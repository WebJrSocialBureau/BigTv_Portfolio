import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authMiddleware from './middleware/auth.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import {
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser
} from './db.js';

dotenv.config();

// Initialize S3Client for Cloudflare R2
const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  region: 'auto',
});

// Configure multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bigtv_newsroom_integrity_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Helper: Generate JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' } // Token valid for 7 days
  );
}

// Routes

// 1. Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, division, bio, status } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and access key are required.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'This network email is already registered.' });
    }

    // Create user in DB
    const newUser = await createUser({
      name,
      email,
      password,
      division,
      bio,
      status
    });

    // Generate Token
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// 2. Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and access key are required.' });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate Token
    const token = generateToken(user);

    // Remove password hash from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// 3. Get Current User Profile (JWT Protected)
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ message: 'Internal server error fetching profile.' });
  }
});

// 4. Update Profile (JWT Protected)
app.put('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const { name, division, bio, status, portfolio } = req.body;

    const updatedUser = await updateUser(req.user.id, {
      name,
      division,
      bio,
      status,
      portfolio
    });

    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Internal server error updating profile.' });
  }
});

// 4.5. Upload Media to Cloudflare R2 (JWT Protected)
app.post('/api/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

    const params = {
      Bucket: process.env.R2_BUCKET,
      Key: uniqueFileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFileName}`;
    res.json({ url: publicUrl });
  } catch (err) {
    console.error('Cloudflare R2 Upload Error:', err);
    res.status(500).json({ message: 'Failed to upload media to server storage.' });
  }
});

// 5. Get All Users (Excludes passwords)
app.get('/api/users', async (req, res) => {
  try {
    const usersList = await getUsers();
    res.json(usersList);
  } catch (err) {
    console.error('Fetch users list error:', err);
    res.status(500).json({ message: 'Internal server error fetching user directories.' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`BIG TV Newsrooms backend active on port ${PORT}`);
  console.log(`Proxy endpoint: http://localhost:${PORT}`);
  console.log(`========================================`);
});

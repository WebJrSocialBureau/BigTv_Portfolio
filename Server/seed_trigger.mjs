import { default as mongoose } from 'mongoose';

// Import db.js to trigger seedDefaultAccounts on connection open
import './db.js';

// Wait for seed to complete then exit
setTimeout(() => {
  console.log('Seed script completed.');
  process.exit(0);
}, 5000);

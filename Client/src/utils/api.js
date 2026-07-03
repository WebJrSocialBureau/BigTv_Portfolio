/**
 * Central API configuration for BigTV Portfolios.
 *
 * In LOCAL DEV: VITE_API_BASE_URL is empty, so all fetch calls use relative
 *   paths (/api/...) which Vite's dev proxy forwards to localhost:5000.
 *
 * In PRODUCTION (Vercel): VITE_API_BASE_URL is set to the full Render URL
 *   (e.g. https://bigtv-server.onrender.com), so all fetch calls hit the
 *   deployed backend directly.
 *
 * Usage: import { API_BASE_URL } from '../utils/api.js'
 *        fetch(`${API_BASE_URL}/api/users`)
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

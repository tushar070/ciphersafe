import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json({ limit: '10mb' }));

// SQLite database
let db;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-change-in-production';

// Initialize database with enhanced tables
async function initDatabase() {
  try {
    db = await open({
      filename: './ciphersafe.db',
      driver: sqlite3.Database
    });

    console.log('🔗 SQLite database connected successfully');

    // Enhanced users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        is_active BOOLEAN DEFAULT 1
      )
    `);

    // Enhanced vaults table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS vaults (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        encrypted_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        version INTEGER DEFAULT 1
      )
    `);

    // User settings table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        theme TEXT DEFAULT 'dark',
        auto_lock INTEGER DEFAULT 30,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('🎯 Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

// Enhanced Routes

// Health check with stats
app.get('/api/health', async (req, res) => {
  try {
    await db.get('SELECT 1 as test');
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const vaultCount = await db.get('SELECT COUNT(*) as count FROM vaults');
    
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      stats: {
        users: userCount.count,
        vaults: vaultCount.count
      },
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

// User Registration with enhanced validation
app.post('/api/register', async (req, res) => {
  console.log('📝 Registration attempt:', req.body);
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }
    
    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a valid email address' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters long' 
      });
    }
    
    // Check if user exists
    const userExists = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        error: 'An account with this email already exists' 
      });
    }
    
    // Hash password with enhanced security
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const result = await db.run(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    // Create default user settings
    await db.run(
      'INSERT INTO user_settings (user_id) VALUES (?)',
      [result.lastID]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.lastID, 
        email: email,
        type: 'auth'
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Longer expiry for better UX
    );
    
    console.log('✅ User created successfully:', email);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to CipherSafe.',
      token,
      user: { 
        id: result.lastID, 
        email: email,
        firstLogin: true 
      }
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Unable to create account. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Enhanced Login with better security and legacy support
app.post('/api/login', async (req, res) => {
  console.log('🔐 Login attempt:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }
    
    // Find user - support both active and legacy users
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (!user) {
      console.log('❌ Login failed: User not found', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      console.log('❌ Login failed: Invalid password for', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }
    
    // Update last login
    await db.run(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'auth'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ Login successful:', email);
    
    // Return response in both new and legacy formats for compatibility
    res.json({
      success: true,
      message: 'Welcome back!',
      token,
      user: { 
        id: user.id, 
        email: user.email,
        firstLogin: false 
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Unable to login. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user vault
app.get('/api/vault', authenticateToken, async (req, res) => {
  try {
    const vault = await db.get(
      'SELECT encrypted_data, version FROM vaults WHERE user_id = ?',
      [req.user.userId]
    );
    
    if (!vault) {
      return res.json({ 
        success: true,
        encryptedData: null,
        version: 1 
      });
    }
    
    res.json({ 
      success: true,
      encryptedData: vault.encrypted_data,
      version: vault.version 
    });
    
  } catch (error) {
    console.error('❌ Vault fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Unable to load vault' 
    });
  }
});

// Save user vault
app.post('/api/vault', authenticateToken, async (req, res) => {
  try {
    const { encryptedData, version = 1 } = req.body;
    
    if (!encryptedData) {
      return res.status(400).json({ 
        success: false,
        error: 'Encrypted data is required' 
      });
    }
    
    // Check if vault exists
    const existingVault = await db.get(
      'SELECT id, version FROM vaults WHERE user_id = ?',
      [req.user.userId]
    );
    
    if (existingVault) {
      // Update existing vault with version check
      await db.run(
        'UPDATE vaults SET encrypted_data = ?, updated_at = CURRENT_TIMESTAMP, version = ? WHERE user_id = ?',
        [encryptedData, version, req.user.userId]
      );
    } else {
      // Create new vault
      await db.run(
        'INSERT INTO vaults (user_id, encrypted_data, version) VALUES (?, ?, ?)',
        [req.user.userId, encryptedData, version]
      );
    }
    
    res.json({ 
      success: true,
      message: 'Vault saved successfully' 
    });
    
  } catch (error) {
    console.error('❌ Vault save error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Unable to save vault' 
    });
  }
});

// Get user settings
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await db.get(
      'SELECT theme, auto_lock FROM user_settings WHERE user_id = ?',
      [req.user.userId]
    );
    
    res.json({ 
      success: true,
      settings: settings || { theme: 'dark', auto_lock: 30 }
    });
    
  } catch (error) {
    console.error('❌ Settings fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Unable to load settings' 
    });
  }
});

// Enhanced authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access token required' 
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: 'Session expired. Please login again.' 
      });
    }
    req.user = user;
    next();
  });
}

// Initialize and start server
async function startServer() {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n✨ 🚀 CipherSafe Server v2.0`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/api/health`);
      console.log(`🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Started: ${new Date().toLocaleString()}`);
      console.log(`\n🔐 Ready for secure password management...\n`);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Enhanced error handling
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  if (db) {
    await db.close();
  }
  process.exit(0);
});

startServer();

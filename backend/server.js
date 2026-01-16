import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_NAME || 'user_management',
}

let db

// Initialize database connection
async function initDB() {
  try {
    db = await mysql.createConnection(dbConfig)
    console.log('Connected to MySQL database')

    // Create users table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        avatar VARCHAR(500) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    console.log('Database initialized')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

// Routes

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Insert new user (in production, hash the password!)
    const [result] = await db.execute(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, password, first_name || email.split('@')[0], last_name || '']
    )

    const [user] = await db.execute('SELECT id, email, first_name, last_name, avatar FROM users WHERE id = ?', [result.insertId])

    res.status(201).json({
      message: 'User registered successfully',
      user: user[0],
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, avatar FROM users WHERE email = ? AND password = ?',
      [email, password]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    res.json({
      message: 'Login successful',
      user: users[0],
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get all users (for dashboard)
app.get('/api/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const perPage = 6
    const offset = (page - 1) * perPage

    // LIMIT and OFFSET must be integers, not placeholders in mysql2
    const [users] = await db.execute(
      `SELECT id, email, first_name, last_name, avatar FROM users LIMIT ${perPage} OFFSET ${offset}`
    )

    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM users')
    const total = countResult[0].total
    const totalPages = Math.ceil(total / perPage)

    res.json({
      data: users || [],
      page,
      per_page: perPage,
      total,
      total_pages: totalPages || 1,
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, avatar FROM users WHERE id = ?',
      [id]
    )

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ data: users[0] })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { email, first_name, last_name } = req.body

    await db.execute(
      'UPDATE users SET email = ?, first_name = ?, last_name = ? WHERE id = ?',
      [email, first_name, last_name, id]
    )

    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, avatar FROM users WHERE id = ?',
      [id]
    )

    res.json({ data: users[0] })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const { email, first_name, last_name } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Check if user already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const [result] = await db.execute(
      'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
      [email, first_name || '', last_name || '', 'temp_password']
    )

    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, avatar FROM users WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json({ data: users[0] })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    await db.execute('DELETE FROM users WHERE id = ?', [id])
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// Start server
async function startServer() {
  await initDB()
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`)
  })
}

startServer()

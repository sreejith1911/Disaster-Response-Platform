import express from 'express';
import connectDB from './db.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const app = express();

// JWT Secret (In production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Connect to database first
let db;

connectDB()
  .then((database) => {
    db = database;
    console.log('Database connected successfully');

    // ============================================
    // AUTH ROUTES
    // ============================================

    // Signup Route
    app.post('/api/auth/signup', async (req, res) => {
      try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
          name,
          email,
          password: hashedPassword,
          createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);

        // Generate JWT token
        const token = jwt.sign(
          { userId: result.insertedId, email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: {
            id: result.insertedId,
            name,
            email
          }
        });
      } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
      }
    });

    // Login Route
    app.post('/api/auth/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await db.collection('users').findOne({ email });
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
      }
    });

    // Middleware to verify JWT token
    const authenticateToken = (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        return res.status(401).json({ error: 'Access token required' });
      }

      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
      });
    };

    // Protected route example
    app.get('/api/auth/me', authenticateToken, async (req, res) => {
      try {
        const user = await db.collection('users').findOne(
          { email: req.user.email },
          { projection: { password: 0 } } // Don't send password
        );
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    });

    // ============================================
    // EXISTING ROUTES (Alerts & Resources)
    // ============================================

    // Home page routes (limit 3)
    app.get('/api/home/alerts', async (req, res) => {
      try {
        console.log('Fetching home alerts...');
        const data = await db.collection('alerts').find().limit(3).toArray();
        console.log('Home alerts found:', data.length);
        res.json(data);
      } catch (error) {
        console.log("Error fetching home alerts:", error);
        res.status(500).json({ error: "Failed to fetch alerts" });
      }
    });

    app.get('/api/home/resources', async (req, res) => {
      try {
        console.log('Fetching home resources...');
        const data = await db.collection('resources').find().limit(3).toArray();
        console.log('Home resources found:', data.length);
        res.json(data);
      } catch (error) {
        console.log("Error fetching home resources:", error);
        res.status(500).json({ error: "Failed to fetch resources" });
      }
    });

    // Full pages routes (all data)
    app.get('/api/alerts', async (req, res) => {
      try {
        console.log('Fetching ALL alerts...');
        const data = await db.collection('alerts').find().toArray();
        console.log('ALL alerts found:', data.length);
        res.json(data);
      } catch (error) {
        console.log("Error fetching all alerts:", error);
        res.status(500).json({ error: "Failed to fetch alerts" });
      }
    });

    app.get('/api/resources', async (req, res) => {
      try {
        console.log('Fetching ALL resources...');
        const data = await db.collection('resources').find().toArray();
        console.log('ALL resources found:', data.length);
        res.json(data);
      } catch (error) {
        console.log("Error fetching all resources:", error);
        res.status(500).json({ error: "Failed to fetch resources" });
      }
    });
    // POST route - create new alert
app.post('/api/alerts', async (req, res) => {
  try {
    const newAlert = req.body;

    await db.collection('alerts').insertOne(newAlert);
    res.status(201).json({ message: 'Alert created successfully' });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});
  // POST route - create new resource
app.post('/api/resources', async (req, res) => {
  try {
    const newResource = req.body;
    // Validate required fields
    const requiredFields = ['name', 'location', 'lat', 'lng', 'bedsAvailable', 'lastUpdated'];
    for (const field of requiredFields) {
      if (!newResource[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    await db.collection('resources').insertOne(newResource);
    res.status(201).json({ message: 'Resource created successfully' });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});
// GET single alert by ID
app.get("/api/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Fetching alert for ID:", id);

    // Your _id values are strings, not ObjectIds
    // This will match both your custom id (DLR001) and _id (string)
    const alert = await db.collection("alerts").findOne({
      $or: [{ _id: id }, { id }]
    });

    if (!alert) {
      console.log(" Alert not found for:", id);
      return res.status(404).json({ error: "Alert not found" });
    }

    console.log(" Found alert:", alert.alertTitle);
    res.json(alert);
  } catch (error) {
    console.error(" Error fetching alert:", error);
    res.status(500).json({ error: "Failed to fetch alert" });
  }
});


// GET single blog by ID

// GET single resource by ID


    // Start server AFTER all routes are defined
    app.listen(5000, () => {
      console.log("Server listening on port 5000");
      console.log("Routes registered:");
      console.log("  GET /");
      console.log("  POST /api/auth/signup");
      console.log("  POST /api/auth/login");
      console.log("  GET /api/auth/me (protected)");
      console.log("  GET /api/home/alerts");
      console.log("  GET /api/home/resources");
      console.log("  GET /api/alerts");
      console.log("  GET /api/resources");
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
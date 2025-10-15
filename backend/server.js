// Import required modules
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// Create an Express application
const app = express();
const PORT = 4000;

// Secret key for signing JWT tokens (in production, use environment variables!)
const JWT_SECRET = 'your-secret-key-change-in-production';

// ============ MIDDLEWARE ============

// Enable CORS so the React frontend (running on port 5173) can make requests
app.use(cors());

// Parse incoming JSON data in request bodies
app.use(express.json());

// ============ FAKE DATABASE ============

// In-memory array to store users (resets when server restarts)
// In a real app, you'd use a database like MongoDB or PostgreSQL
let users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com' },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com' },
    { id: 6, name: 'Frank Miller', email: 'frank@example.com' },
    { id: 7, name: 'Grace Lee', email: 'grace@example.com' },
    { id: 8, name: 'Henry Wilson', email: 'henry@example.com' },
    { id: 9, name: 'Iris Taylor', email: 'iris@example.com' },
    { id: 10, name: 'Jack Anderson', email: 'jack@example.com' },
];

// Counter for generating new user IDs
let nextUserId = 11;

// ============ JWT AUTHENTICATION MIDDLEWARE ============

/**
 * Middleware function to verify JWT tokens
 * This protects routes by ensuring the user has a valid token
 */
function authenticateToken(req, res, next) {
    // Get the Authorization header from the request
    // Format expected: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "

    // If no token is provided, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    // Verify the token using the secret key
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid or expired
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Token is valid, attach user info to request object
        req.user = user;
        next(); // Continue to the next middleware or route handler
    });
}

// ============ PUBLIC ROUTES (No Authentication Required) ============

/**
 * POST /login
 * Login endpoint that issues a JWT token
 * 
 * Request body: { username: "any-username" }
 * Response: { token: "jwt-token", username: "username" }
 */
app.post('/login', (req, res) => {
    const { username } = req.body;

    // Validate that username is provided
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Create a JWT token with the username
    // Token expires in 1 hour (3600 seconds)
    const token = jwt.sign(
        { username }, // Payload (data stored in token)
        JWT_SECRET,   // Secret key for signing
        { expiresIn: '1h' } // Token expiration time
    );

    // Send the token back to the client
    res.json({
        token,
        username,
        message: 'Login successful'
    });
});

// ============ PROTECTED ROUTES (Authentication Required) ============

/**
 * GET /users
 * Get all users with pagination support
 * 
 * Query params:
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 5)
 * 
 * Response: { users: [...], page, totalPages, totalUsers }
 */
app.get('/users', authenticateToken, (req, res) => {
    // Get pagination parameters from query string (with defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Calculate start and end indices for slicing the array
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get the slice of users for this page
    const paginatedUsers = users.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(users.length / limit);

    // Send paginated response
    res.json({
        users: paginatedUsers,
        page,
        limit,
        totalPages,
        totalUsers: users.length
    });
});

/**
 * POST /users
 * Create a new user
 * 
 * Request body: { name: "User Name", email: "email@example.com" }
 * Response: { user: {...}, message: "User created" }
 */
app.post('/users', authenticateToken, (req, res) => {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create new user object
    const newUser = {
        id: nextUserId++,
        name,
        email
    };

    // Add to users array
    users.push(newUser);

    // Send success response with the created user
    res.status(201).json({
        user: newUser,
        message: 'User created successfully'
    });
});

/**
 * DELETE /users/:id
 * Delete a user by ID
 * 
 * URL param: id (user ID to delete)
 * Response: { message: "User deleted", deletedUser: {...} }
 */
app.delete('/users/:id', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.id);

    // Find the user index
    const userIndex = users.findIndex(user => user.id === userId);

    // Check if user exists
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Remove user from array
    const deletedUser = users.splice(userIndex, 1)[0];

    // Send success response
    res.json({
        message: 'User deleted successfully',
        deletedUser
    });
});

// ============ TEST ROUTE ============

/**
 * GET /
 * Simple test route to check if server is running
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Backend API is running!',
        endpoints: {
            login: 'POST /login',
            getUsers: 'GET /users?page=1&limit=5',
            createUser: 'POST /users',
            deleteUser: 'DELETE /users/:id'
        }
    });
});

// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📝 Try logging in at POST http://localhost:${PORT}/login`);
});

// Import axios for making HTTP requests
import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:4000';

// Create an axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * REQUEST INTERCEPTOR
 * Automatically adds the JWT token to every request (if it exists)
 * This runs before every API call is sent
 */
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR
 * Handles errors globally (like expired tokens)
 * This runs after every API response is received
 */
api.interceptors.response.use(
    (response) => {
        // If response is successful, just return it
        return response;
    },
    (error) => {
        // If we get a 401 or 403, the token might be invalid/expired
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Clear the token and reload to go back to login
            localStorage.removeItem('token');
            localStorage.removeItem('username');

            // Optional: You could redirect to login here
            console.error('Token expired or invalid. Please login again.');
        }

        return Promise.reject(error);
    }
);

// ============ API FUNCTIONS ============

/**
 * Login and get JWT token
 * @param {string} username - The username to login with
 * @returns {Promise} Response with token and username
 */
export const login = async (username) => {
    const response = await api.post('/login', { username });
    return response.data;
};

/**
 * Get all users with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 5)
 * @returns {Promise} Response with users array and pagination info
 */
export const getUsers = async (page = 1, limit = 5) => {
    const response = await api.get('/users', {
        params: { page, limit }
    });
    return response.data;
};

/**
 * Create a new user
 * @param {Object} userData - Object with name and email
 * @returns {Promise} Response with created user
 */
export const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

/**
 * Delete a user by ID
 * @param {number} userId - ID of user to delete
 * @returns {Promise} Response with success message
 */
export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};

// Export the axios instance as default if you need custom requests
export default api;

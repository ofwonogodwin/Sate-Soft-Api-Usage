// Import necessary hooks and API function
import { useState } from 'react';
import { login } from './api';

/**
 * Login Component
 * Allows users to enter a username and get a JWT token
 */
function Login({ onLoginSuccess }) {
    // State to store the username input
    const [username, setUsername] = useState('');

    // State to store any error messages
    const [error, setError] = useState('');

    // State to show loading during login
    const [loading, setLoading] = useState(false);

    /**
     * Handle form submission
     * Sends username to backend and stores the returned JWT token
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        // Clear any previous errors
        setError('');

        // Validate username is not empty
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        try {
            setLoading(true);

            // Call the login API function
            const data = await login(username);

            // Store token and username in localStorage
            // localStorage persists data even after browser closes
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);

            // Notify parent component that login was successful
            onLoginSuccess();

        } catch (err) {
            // Handle errors (network issues, server errors, etc.)
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Login</h1>
                <p style={styles.subtitle}>Enter any username to get a JWT token</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    {/* Show error message if there is one */}
                    {error && <p style={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={styles.hint}>
                    Tip: Any username works! This is for learning purposes.
                </p>
            </div>
        </div>
    );
}

// ============ STYLES ============
// Simple inline styles for the component

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
    },
    card: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        margin: '0 0 0.5rem 0',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        margin: '0 0 1.5rem 0',
        color: '#666',
        textAlign: 'center',
        fontSize: '0.9rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    error: {
        color: '#dc3545',
        margin: '0',
        fontSize: '0.9rem',
    },
    hint: {
        marginTop: '1rem',
        fontSize: '0.85rem',
        color: '#666',
        textAlign: 'center',
    },
};

export default Login;

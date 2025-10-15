// Import necessary hooks and API function
import { useState } from 'react';
import { createUser } from './api';

/**
 * AddUser Component
 * Form to add a new user to the system
 */
function AddUser({ onUserAdded }) {
    // State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // State for loading and errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    /**
     * Handle form submission
     * Sends new user data to backend API
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        // Clear previous messages
        setError('');
        setSuccess('');

        // Validate inputs
        if (!name.trim() || !email.trim()) {
            setError('Please fill in all fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);

            // Call API to create new user
            const data = await createUser({ name, email });

            // Show success message
            setSuccess(`User "${data.user.name}" added successfully!`);

            // Clear form inputs
            setName('');
            setEmail('');

            // Notify parent component that a user was added
            // This will trigger a refresh of the user list
            if (onUserAdded) {
                onUserAdded();
            }

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);

        } catch (err) {
            console.error('Error adding user:', err);
            setError(err.response?.data?.error || 'Failed to add user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>➕ Add New User</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Name Input */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter user's name"
                        style={styles.input}
                        disabled={loading}
                    />
                </div>

                {/* Email Input */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter user's email"
                        style={styles.input}
                        disabled={loading}
                    />
                </div>

                {/* Error Message */}
                {error && <p style={styles.error}>{error}</p>}

                {/* Success Message */}
                {success && <p style={styles.success}>{success}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add User'}
                </button>
            </form>
        </div>
    );
}

// ============ STYLES ============

const styles = {
    container: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
    },
    title: {
        margin: '0 0 1rem 0',
        color: '#333',
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
        fontSize: '0.9rem',
    },
    input: {
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#28a745',
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
    success: {
        color: '#28a745',
        margin: '0',
        fontSize: '0.9rem',
    },
};

export default AddUser;

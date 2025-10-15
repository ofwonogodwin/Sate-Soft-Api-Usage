// Importing the  hooks and components
import { useState } from 'react';
import AddUser from './AddUser';
import UserList from './UserList';

/**
 * Dashboard Component
 * Main app interface after login
 * Shows user management features and logout button
 */
function Dashboard({ onLogout }) {
    // State to trigger refresh of user list when a new user is added
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Get username from localStorage
    const username = localStorage.getItem('username');

    /**
     * Handle user added event
     * Increments refresh trigger to reload user list
     */
    const handleUserAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    /**
     * Handle logout
     * Clears token and username from localStorage
     */
    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        // Notify parent component to show login screen
        onLogout();
    };

    return (
        <div style={styles.container}>
            {/* Header with welcome message and logout button */}
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>User Management Dashboard</h1>
                    <p style={styles.welcome}>Welcome, <strong>{username}</strong>!</p>
                </div>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </header>

            {/* Main content area */}
            <main style={styles.main}>
                {/* Add User Form */}
                <AddUser onUserAdded={handleUserAdded} />

                {/* User List with Pagination */}
                <UserList refreshTrigger={refreshTrigger} />
            </main>

            {/* Footer with helpful info */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    This is a learning project demonstrating REST API integration with JWT authentication
                </p>
            </footer>
        </div>
    );
}

// ============ STYLES ============

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '2rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        margin: '0 0 0.5rem 0',
        color: '#333',
    },
    welcome: {
        margin: '0',
        color: '#666',
        fontSize: '1rem',
    },
    logoutButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    footer: {
        marginTop: '2rem',
        textAlign: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: '0.9rem',
    },
};

export default Dashboard;

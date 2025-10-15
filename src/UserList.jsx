// Import necessary hooks and API functions
import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from './api';

/**
 * UserList Component
 * Displays a paginated list of users with delete functionality
 */
function UserList({ refreshTrigger }) {
    // State to store the list of users
    const [users, setUsers] = useState([]);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // State for loading and errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Fetch users from the API
     * This function is called when the component mounts and when page changes
     */
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');

            // Call API to get users for current page
            const data = await getUsers(currentPage, 5); // 5 users per page

            // Update state with the response data
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotalUsers(data.totalUsers);

        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.error || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle deleting a user
     * @param {number} userId - ID of the user to delete
     */
    const handleDelete = async (userId) => {
        // Confirm before deleting
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            // Call API to delete user
            await deleteUser(userId);

            // Refresh the user list after deletion
            // If we deleted the last user on a page, go to previous page
            if (users.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchUsers();
            }

        } catch (err) {
            console.error('Error deleting user:', err);
            alert(err.response?.data?.error || 'Failed to delete user');
        }
    };

    /**
     * useEffect hook to fetch users when:
     * - Component first mounts
     * - Current page changes
     * - refreshTrigger changes (when a new user is added)
     */
    useEffect(() => {
        fetchUsers();
    }, [currentPage, refreshTrigger]);

    /**
     * Handle going to previous page
     */
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    /**
     * Handle going to next page
     */
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>👥 User List</h2>
                <p style={styles.info}>
                    Total Users: {totalUsers} | Page {currentPage} of {totalPages}
                </p>
            </div>

            {/* Show loading message */}
            {loading && <p style={styles.loading}>Loading users...</p>}

            {/* Show error message */}
            {error && <p style={styles.error}>{error}</p>}

            {/* Show users table */}
            {!loading && !error && users.length > 0 && (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} style={styles.tableRow}>
                                    <td style={styles.td}>{user.id}</td>
                                    <td style={styles.td}>{user.name}</td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            style={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div style={styles.pagination}>
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            style={{
                                ...styles.paginationButton,
                                ...(currentPage === 1 ? styles.disabledButton : {})
                            }}
                        >
                            ← Previous
                        </button>

                        <span style={styles.pageInfo}>
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            style={{
                                ...styles.paginationButton,
                                ...(currentPage === totalPages ? styles.disabledButton : {})
                            }}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}

            {/* Show message if no users */}
            {!loading && !error && users.length === 0 && (
                <p style={styles.noUsers}>No users found. Add some users to get started!</p>
            )}
        </div>
    );
}

// Inline styling

const styles = {
    container: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    header: {
        marginBottom: '1.5rem',
    },
    title: {
        margin: '0 0 0.5rem 0',
        color: '#333',
    },
    info: {
        margin: '0',
        color: '#666',
        fontSize: '0.9rem',
    },
    loading: {
        textAlign: 'center',
        color: '#666',
    },
    error: {
        color: '#dc3545',
        textAlign: 'center',
    },
    noUsers: {
        textAlign: 'center',
        color: '#666',
        padding: '2rem',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '1rem',
    },
    tableHeader: {
        backgroundColor: '#f8f9fa',
    },
    th: {
        padding: '0.75rem',
        textAlign: 'left',
        borderBottom: '2px solid #dee2e6',
        fontWeight: 'bold',
        color: '#333',
    },
    tableRow: {
        borderBottom: '1px solid #dee2e6',
    },
    td: {
        padding: '0.75rem',
    },
    deleteButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
    },
    paginationButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
    pageInfo: {
        color: '#666',
        fontSize: '0.9rem',
    },
};

export default UserList;

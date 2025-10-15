// Import necessary hooks and components
import { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

/**
 * Main App Component
 * Handles authentication state and shows Login or Dashboard
 */
function App() {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check if user is already logged in when app loads
   * This checks for a token in localStorage
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // Empty array means this runs once when component mounts

  /**
   * Handle successful login
   * Called when user successfully logs in
   */
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  /**
   * Handle logout
   * Called when user clicks logout button
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {/* Conditional rendering: show Login or Dashboard based on authentication */}
      {isAuthenticated ? (
        // User is logged in - show Dashboard
        <Dashboard onLogout={handleLogout} />
      ) : (
        // User is NOT logged in - show Login page
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;

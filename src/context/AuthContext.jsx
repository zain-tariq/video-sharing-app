import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(() => {
    const savedPermissions = localStorage.getItem('permissions');
    return savedPermissions ? JSON.parse(savedPermissions) : {
      canUpload: false,
      canComment: false,
      canRate: false
    };
  });

  useEffect(() => {
    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedPermissions = localStorage.getItem('permissions');
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    if (storedPermissions) {
      try {
        setPermissions(JSON.parse(storedPermissions));
      } catch (error) {
        console.error('Error parsing stored permissions:', error);
        localStorage.removeItem('permissions');
      }
    }
    
    setLoading(false);
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);
  
  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);
  
  // Save permissions to localStorage whenever they change
  useEffect(() => {
    if (permissions) {
      localStorage.setItem('permissions', JSON.stringify(permissions));
    } else {
      localStorage.removeItem('permissions');
    }
  }, [permissions]);

  // Explicitly compute isAuthenticated based on token existence
  const isAuthenticated = !!token;
  
  const login = (userData, authToken) => {
    setCurrentUser(userData);
    setToken(authToken);
    
    // Set permissions based on user role from the API response
    if (userData && userData.permissions) {
      setPermissions(userData.permissions);
    } else if (userData && userData.role) {
      // Fallback if permissions not explicitly provided
      setPermissions({
        canUpload: userData.role === 'creator',
        canComment: userData.role === 'consumer',
        canRate: userData.role === 'consumer'
      });
    }
  };

  const logout = async () => {
    try {
      // Call the backend logout endpoint
      if (token) {
        await fetch(`/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data regardless of API call success
      setCurrentUser(null);
      setToken(null);
      setPermissions({
        canUpload: false,
        canComment: false,
        canRate: false
      });
      
      // Clear all auth-related data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      
      console.log('Logged out, all user data cleared');
    }
  };

  // Use the computed isAuthenticated value consistently
  const value = {
    currentUser,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    permissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

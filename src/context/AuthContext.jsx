import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on component mount
    const userString = localStorage.getItem("user");
    if (userString) {
      const userData = JSON.parse(userString);
      // Verify the token exists in stored data
      if (userData && userData.token) {
        setUser(userData);
      } else {
        // Clear invalid data
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3030/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the entire user object including the token
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Frontend/context/AuthContext.js
  const googleLogin = async (userInfo) => {
    try {
      console.log("Google login data:", userInfo);

      const response = await fetch("http://localhost:3030/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      localStorage.setItem("user", JSON.stringify(data));
      console.log(localStorage.getItem("user"));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:3030/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store the user data (including the token) in localStorage
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data); // Update the user state
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Helper function to get current auth token
  const getToken = () => {
    return user?.token || null;
  };

  // Helper function to get auth header
  const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    login,
    googleLogin,
    register, // Add register here
    logout,
    loading,
    getToken,
    getAuthHeader,
    isAuthenticated: !!user?.token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

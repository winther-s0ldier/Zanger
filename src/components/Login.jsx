import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  // Normal email/password login handler…
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/research");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to login");
    }
    setLoading(false);
  };

  // Google login handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setLoading(true);

        // Check that the access token is present
        if (!response.access_token) {
          throw new Error("No access token received from Google");
        }

        // Use the access token to fetch user details from Google
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        const userInfo = await userInfoResponse.json();

        if (!userInfo.email) {
          throw new Error("Failed to retrieve user info from Google");
        }

        // Prepare the data to send to your backend
        const loginData = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          googleToken: response.access_token, // This is the key property the server expects
        };

        // Optionally, log the data for debugging
        console.log("User info to be sent:", loginData);

        // Call your context function to perform Google login
        const result = await googleLogin(loginData);
        if (result.success) {
          navigate("/research");
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Google login failed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google login failed");
      setLoading(false);
    },
    // Your scopes here; you may adjust them as needed
    scope:
      "email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send",
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </form>
              <button
                onClick={() => handleGoogleLogin()}
                className="btn btn-outline-dark w-100 mt-3"
                disabled={loading}
              >
                Login with Google
              </button>
              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

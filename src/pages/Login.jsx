import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ErrorMessage from "../components/ErrorMessage";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API_ENDPOINTS from "../config/apiConfig";

// Login Page: Handles user authentication and session creation
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // UI-level error state
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function from AuthContext

  // Validates user input before sending data to the server
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setError("Invalid email format!");
      return false;
    }
    return true;
  };

  // Main login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    if (!validateInputs()) return;

    setLoading(true);
    
    // Show a temporary loading toast to give immediate feedback
    const loadingToast = toast.loading("Signing in...");

    try {
      // Step 1: Send credentials to the backend
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // Step 2: Handle failed authentication (Invalid password/email)
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Invalid credentials or network error.";
        try {
          // Attempt to parse JSON error message if provided by server
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Step 3: Extract the Authentication Token (JWT)
      const text = await response.text();
      let token;
      
      try {
        const data = JSON.parse(text);
        token = data.token || data;
      } catch (e) {
        token = text; // Server returned raw JWT string
      }

      if (token) {
        // Step 4: Save token and redirect
        login(token); // Triggers AuthContext update
        toast.success("Welcome back!", { id: loadingToast });
        navigate("/"); 
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      // Step 5: Handle errors gracefully in the UI
      console.error("Login Error:", err);
      setError(err.message || "Login failed");
      toast.dismiss(loadingToast); // Remove the loading toast on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh] md:h-screen">
      <div className="w-[80%] md:max-w-sm bg-(--border-color) rounded-xl shadow-2xl overflow-hidden p-6 ">
        <div className="text-center md:mb-6">
          <h2 className="text-3xl font-extrabold text-(--text-color)">
            Welcome Back
          </h2>
          <p className="text-(--text-color) mt-2 text-sm">
            Please sign in to your account
          </p>
        </div>

        {/* Displays form-level errors if they exist */}
        <ErrorMessage message={error} onClose={() => setError("")} />

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-(--text-color) mb-0.5">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputsStyle}
              placeholder="admin@example.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-xs font-medium text-(--text-color) mb-0.5">
              Password
            </label>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputsStyle}
              placeholder="••••••••"
            />

            {/* Toggle password visibility */}
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-6.5 text-(--primary-color) cursor-pointer transition-colors">
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </span>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-(--primary-color) cursor-pointer text-white py-2 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm mt-6">
            Create Account!
            <Link to="/register" className="text-(--primary-color) font-semibold px-2 hover:text-(--text-color)">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// Global reusable style for form inputs
export const inputsStyle = "w-full px-3 py-1.5 text-(--text-color) border rounded-lg focus:ring-(--primary-color) focus:ring-2 focus:border-transparent outline-none transition-colors text-sm";
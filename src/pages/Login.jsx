import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API_ENDPOINTS from "../config/apiConfig";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateInputs = () => {
    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check for at least 8 characters, one uppercase letter, one number, and one special character
    // The previous regex might be too strict for existing accounts. 
    // We'll keep it as the user had it.
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~]).{8,}$/;

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }
    // Commented out the strict password check for login because it prevents logging into older accounts that don't match the regex. Registration should enforce it.
    // if (!passwordRegex.test(password)) {
    //   toast.error("Weak password! Must include an uppercase letter, a number, and a special character.");
    //   return false;
    // }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);
    
    const loadingToast = toast.loading("Signing in...");

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email: email,
        password: password,
      });

      const token = response.data.token || response.data; // Handle string or object return

      if (token) {
        login(token); // Update AuthContext
        
        // Update the toast to success
        toast.success("Welcome back!", { id: loadingToast });
        
        navigate("/"); 
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      // Update the toast to failure
      const errorMsg = err.response?.data?.message || err.response?.data || "Invalid credentials or network error.";
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Login failed", { id: loadingToast });
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

export const inputsStyle = "w-full px-3 py-1.5 text-(--text-color) border rounded-lg focus:ring-(--primary-color) focus:ring-2 focus:border-transparent outline-none transition-colors text-sm";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { inputsStyle } from "./Login";
import toast from "react-hot-toast";
import ErrorMessage from "../components/ErrorMessage";
import API_ENDPOINTS from "../config/apiConfig";

// Register Page: Allows new users to create accounts
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Local UI error state

  const [loading, setLoading] = useState(false);

  // Handles the account creation logic
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error state

    // 1️ Client-side Validation: Ensure all fields are filled
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // 2️ Username Validation: Alphanumeric only (no spaces)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(name)) {
      setError("Username can only contain letters and numbers (no spaces).");
      return;
    }

    // 3️ Password Match Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // 4️ Strict Password Policy: Upper case, Number, Special Char, Min 8 chars
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Weak password! Must include an uppercase letter, a number, and a special character.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      // Step 5: Send registration data to the API
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: name,
          email: email,
          phoneNumber: phone,
          password: password,
          confirmPassword: confirmPassword
        })
      });

      // Step 6: Handle Success
      if (response.ok) {
        toast.success("Account created successfully!", { id: toastId });
        // Reset form fields
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        // Redirect user to login page
        navigate("/login");
      } else {
        // Step 7: Handle API Errors (e.g., Email already exists)
        const errText = await response.text();
        throw new Error(errText || "Registration failed");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message || "Registration failed");
      toast.dismiss(toastId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:min-h-screen py-20 px-4">
      <div className="w-[80%] md:max-w-sm mx-auto bg-(--border-color) rounded-xl shadow-xl p-6 my-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-(--text-color)">
            Create Account
          </h2>
          <p className="text-(--text-color) mt-2 text-sm">
            Please sign up to continue
          </p>
        </div>

        {/* Displays error messages inline if validation or API fails */}
        <ErrorMessage message={error} onClose={() => setError("")} />

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-(--text-color) mb-1">
              Username
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. gamal123 (No spaces)"
              className={inputsStyle}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={inputsStyle}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className={inputsStyle}
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputsStyle}
            />

            {/* Toggle password visibility */}
            <span
              title={showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-7.5 text-(--primary-color) hover:text-(--text-color) cursor-pointer transition-colors">
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </span>
          </div>

          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-xs font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputsStyle}
            />

            {/* Toggle confirmation password visibility */}
            <span
              title={showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-7.5 text-(--primary-color) hover:text-(--text-color) cursor-pointer transition-colors">
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--primary-color) cursor-pointer text-white py-2 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Social Login Options (UI Only) */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-(--text-color)" />
          <span className="text-sm ">OR</span>
          <div className="flex-1 h-px bg-(--text-color)" />
        </div>

        <button className="w-full flex items-center justify-center gap-7 mb-2 bg-(--primary-color) cursor-pointer text-white py-2 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50">
          Continue With Google
          <FaGoogle />
        </button>

        <button className="w-full flex items-center justify-center gap-2 bg-(--primary-color) cursor-pointer text-white py-2 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50">
          Continue With Facebook
          <FaFacebookF />
        </button>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-(--primary-color) font-semibold px-2 hover:text-(--text-color) transition-all duration-300 cursor-pointer ">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "../context/ThemeToggle";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const { isLoggedIn, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const totalCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out!"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        toast.success("Logged out successfully");
        navigate("/");
      }
    });
  };

  const linkClass = ({ isActive }) => `nav-link relative ${ isActive ? "text-(--primary-color)" : "" }`;

  return (
    <nav className="fixed w-full z-50 bg-(--bg-color)">
      <div className="flex justify-around backdrop-blur-2xl items-center shadow-2xl py-2 px-6 mx-auto my-3 w-[90%] rounded-lg bg-(--border-color)/40">

        {/* Logo */}
        <NavLink to="/" className="font-bold text-lg">
          Logo
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          <NavLink to="/" className={linkClass}>
            {({ isActive }) => (
              <>
                Home
                {isActive && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.2 bg-(--primary-color)"></span>
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/products" className={linkClass}>
            {({ isActive }) => (
              <>
                Shop
                {isActive && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.2 bg-(--primary-color)"></span>
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            {({ isActive }) => (
              <>
                Contact
                {isActive && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.2 bg-(--primary-color)"></span>
                )}
              </>
            )}
          </NavLink>
          
          {userRole === 'Admin' && (
            <NavLink to="/dashboard" className={linkClass}>
              {({ isActive }) => (
                <>
                  Dashboard
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 w-full h-0.2 bg-(--primary-color)"></span>
                  )}
                </>
              )}
            </NavLink>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <NavLink to="/cart" className="relative cursor-pointer group hover:scale-110 transition">
            <svg width="40" height="30" viewBox="0 0 64 64" fill="none">
              <path d="M8 12 H18 L22 24" stroke="currentColor" strokeWidth="4" />
              <path d="M22 24 H52 L48 40 H26 Z" stroke="currentColor" strokeWidth="4" />
              <circle cx="30" cy="54" r="4" fill="currentColor" />
              <circle cx="48" cy="54" r="4" fill="currentColor" />
            </svg>

            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-(--primary-color) text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {totalCount}
              </span>
            )}
          </NavLink>

          <ThemeToggle />

          {isLoggedIn ? (
            <FiLogOut 
              className="text-red-500 cursor-pointer hover:scale-150 transition" 
              size={24} 
              onClick={handleLogout}
              title="Logout"
            />
          ) : (
            <NavLink to="/login" className="hidden md:block text-sm font-bold bg-(--primary-color) text-white px-3 py-1.5 rounded-lg hover:scale-105 transition">
              Login
            </NavLink>
          )}

          {/* Mobile Menu Button */}
          <p className="md:hidden text-(--text-color)" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </p>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-(--border-color) mx-6 rounded-lg p-4 flex flex-col gap-4">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {userRole === 'Admin' && (
            <NavLink to="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {!isLoggedIn && (
            <NavLink to="/login" onClick={() => setOpen(false)} className="text-(--primary-color) font-bold">
              Login / Register
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
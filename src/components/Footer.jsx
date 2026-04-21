import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900/70 text-gray-300 py-5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-wider">
            E-Commerce
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Leading the way in contemporary women's fashion. Defining style with
            elegance, quality, and passion.
          </p>
          {/* Social Icons Placeholder */}
          <div className="flex space-x-4 pt-2">
            <a href="#" className="hover:text-(--primary-color) transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-(--primary-color) transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-(--primary-color) transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-(--primary-color) transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-white transition-colors">
                Shop All
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition-colors">
                My Cart
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Care
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Size Guide
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter (Optional) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Stay in the Loop
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe for the latest trends and exclusive offers.
          </p>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
            />
            <button className="btn py-2! font-bold! text-[20px]!">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-(--primary-color) text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Development By Gamal & Elnagar</p>
      </div>
    </footer>
  );
}

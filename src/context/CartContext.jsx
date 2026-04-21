import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import API_ENDPOINTS from "../config/apiConfig";

// CartContext: Manages all shopping cart operations and persists state
// Connects to the backend API for real-time synchronization of user carts
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); 

  // Function to fetch the current user's cart from the server
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Silent return if not logged in
    try {
      const res = await fetch(API_ENDPOINTS.MY_CART, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data); 
      }
    } catch (err) { console.error("Error fetching cart:", err); }
  };

  // Initial fetch on component mount
  useEffect(() => { fetchCart(); }, []);

  // Adds a product to the cart or increments its quantity
  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");
    
    // Safety Check: Prevent guests from adding items (Redirect to Login)
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "You need to be logged in to add items to your cart.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Later",
        confirmButtonColor: "#4e46e5b8",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }
    
    try {
      const res = await fetch(API_ENDPOINTS.ADD_TO_CART(productId, quantity), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (res.ok) {
        await fetchCart(); // Refresh cart state
        toast.success("Added to cart successfully");
      } else {
        const errorText = await res.text();
        console.error(`Add to cart failed: ${errorText}`);
        toast.error(`Could not add to cart: ${errorText}`);
      }
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error("Network error. Please try again.");
    }
  };

  // Updates the quantity of a specific item already in the cart
  const updateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_CART(productId, newQuantity), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchCart();
        toast.success("Quantity updated");
      } else {
        const errorText = await res.text();
        console.error(`Failed to update: ${errorText}`);
        toast.error("Failed to update quantity");
      }
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  // Removes a specific product completely from the user's cart
  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.REMOVE_FROM_CART(productId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await fetchCart();
        toast.success("Item removed");
      }
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  // Clears all items from the current user's cart
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.CLEAR_CART, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCart(null); // Reset local state
        toast.success("Cart cleared");
      }
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to access cart state and functions easily
export const useCart = () => useContext(CartContext);
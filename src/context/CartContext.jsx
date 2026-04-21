import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); 

  // 1. GET /api/Cart/MyCart
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("https://gemystore.runasp.net/api/Cart/MyCart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data); 
      }
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchCart(); }, []);

  // 2. POST /api/Cart/add-item-to-cart
  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    
    try {
      const res = await fetch(`https://gemystore.runasp.net/api/Cart/add-item-to-cart?productId=${productId}&quantity=${quantity}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (res.ok) {
        await fetchCart();
        toast.success("Added to cart successfully");
      } else {
        const errorText = await res.text();
        toast.error(`Failed: ${errorText}`);
      }
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error("Network error");
    }
  };

  // 3. PUT /api/Cart/update-item-in-cart
  const updateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://gemystore.runasp.net/api/Cart/update-item-in-cart?productId=${productId}&newQuantity=${newQuantity}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      await fetchCart();
    } else {
      const errorText = await res.text();
      toast.error(`Failed to update: ${errorText}`);
    }
  };

  // 4. DELETE /api/Cart/remove-item-from-cart
  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://gemystore.runasp.net/api/Cart/remove-item-from-cart?productId=${productId}`, {
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

  // 5. DELETE /api/Cart/clear
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://gemystore.runasp.net/api/Cart/clear", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setCart(null);
      toast.success("Cart cleared");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
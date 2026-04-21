import React, { useState } from 'react';
import { useCart } from "../context/CartContext";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_ENDPOINTS from "../config/apiConfig";

function Cart() {
  const { cart, addToCart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const [checkoutData, setCheckoutData] = useState({
    phoneNumber: "",
    city: "",
    address: "",
    paymentMethod: "CashOnDelivery"
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const getPrice = (item) => {
    return item.price || item.productPrice || item.unitPrice || item.cost || 0;
  };

  const subtotal = cart?.items?.reduce((acc, item) => acc + (getPrice(item) * item.quantity), 0) || 0;
  const shipping = subtotal > 0 ? 50 : 0; 

  const handleCheckout = async () => {
    if (!checkoutData.phoneNumber || !checkoutData.city || !checkoutData.address) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setIsCheckingOut(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(API_ENDPOINTS.CHECKOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(checkoutData)
      });

      if (res.ok) {
        toast.success("Order created successfully!");
        clearCart(); 
        navigate("/"); // Redirect to home or orders page after success
      } else {
        const errText = await res.text();
        toast.error(`Checkout failed: ${errText}`);
      }
    } catch (error) {
      toast.error("Network error during checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <div className="flex justify-center mb-6">
          <FiShoppingBag size={80} className="opacity-20 text-(--primary-color)" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Your cart is currently empty</h2>
        <p className="opacity-60 mb-8">It looks like you haven't added any products to your cart yet.</p>
        <NavLink 
          to="/products" 
          className="bg-(--primary-color) text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform inline-block"
        >
          Start Shopping Now
        </NavLink>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8 border-l-4 border-(--primary-color) pl-4">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Products List (Left Side) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.items.map((item) => (
            <div 
              key={item.productId} 
              className="bg-(--border-color)/30 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-4 border border-white/5 shadow-sm"
            >
              {/* Product Image */}
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${item.imageUrl}`} 
                alt={item.productName} 
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-bold text-sm md:text-base line-clamp-1">{item.productName}</h3>
                <p className="text-(--primary-color) font-bold text-sm">{getPrice(item)} EGP</p>
                {getPrice(item) === 0 && <p className="text-[10px] text-gray-500">Debug Keys: {Object.keys(item).join(", ")}</p>}
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button 
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.productId, item.quantity - 1);
                      } else {
                        removeItem(item.productId);
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <FiMinus />
                  </button>
                  <span className="font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item.productId)}
                    className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => removeItem(item.productId)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}

          {/* Clear Cart Button */}
          <button 
            onClick={clearCart}
            className="text-red-500 text-sm font-bold flex items-center gap-2 mt-2 w-fit hover:underline"
          >
            <FiTrash2 /> Clear Shopping Cart
          </button>
        </div>

        {/* Order Summary (Right Side) */}
        <div className="lg:col-span-1">
          <div className="bg-(--border-color) p-6 rounded-3xl sticky top-28 shadow-xl border border-white/5">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Checkout Form */}
            <div className="flex flex-col gap-3 mb-6">
              <input 
                type="text" 
                placeholder="Phone Number" 
                className="w-full bg-(--bg-color) text-(--text-color) border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-(--primary-color)"
                value={checkoutData.phoneNumber}
                onChange={e => setCheckoutData({...checkoutData, phoneNumber: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="City" 
                className="w-full bg-(--bg-color) text-(--text-color) border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-(--primary-color)"
                value={checkoutData.city}
                onChange={e => setCheckoutData({...checkoutData, city: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Address" 
                className="w-full bg-(--bg-color) text-(--text-color) border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-(--primary-color)"
                value={checkoutData.address}
                onChange={e => setCheckoutData({...checkoutData, address: e.target.value})}
              />
              <select 
                className="w-full bg-(--bg-color) text-(--text-color) border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-(--primary-color)"
                value={checkoutData.paymentMethod}
                onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
              >
                <option value="CashOnDelivery">Cash on Delivery</option>
                <option value="CreditCard">Credit Card</option>
                <option value="Paypal">PayPal</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 mb-6">
              <div className="flex justify-between opacity-70">
                <span>Subtotal</span>
                <span>{subtotal} EGP</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Shipping Fee</span>
                <span>{shipping} EGP</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-black mb-8">
              <span>Total</span>
              <span className="text-(--primary-color)">{subtotal + shipping} EGP</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-(--primary-color) text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-(--primary-color)/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
            
            <p className="text-[10px] text-center opacity-40 mt-4 uppercase">
              Prices include Value Added Tax (VAT)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;
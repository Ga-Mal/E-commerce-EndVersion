import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiMinus, FiShoppingCart, FiArrowLeft } from "react-icons/fi";

import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import API_ENDPOINTS from "../config/apiConfig";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeItem } = useCart(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // إيجاد المنتج في السلة لمعرفة الكمية الحالية
  const cartItem = cart?.items?.find((item) => item.productId === parseInt(id));
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    const controller = new AbortController();
    const fetchProduct = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(id), {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    return () => controller.abort();
  }, [id]);

  // دالة التعامل مع إضافة منتج للسلة عبر الـ API والـ Context
  const handleQuantityChange = async (type) => {
    setIsAdding(true);
    try {
      if (type === "increment") {
        await addToCart(product.id, 1);
        toast.success("Added to cart");
      } else {
        if (quantity > 1) {
          await updateQuantity(product.id, quantity - 1);
          toast.success("Cart updated");
        } else {
          await removeItem(product.id);
          toast.success("Removed from cart");
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-(--text-color)">Loading Product...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-(--text-color) opacity-70 hover:opacity-100 mb-6 transition-colors"
      >
        <FiArrowLeft /> Back to products
      </button>

      <div className="grid md:grid-cols-2 gap-10 bg-(--secondary-color) p-4 md:p-8 rounded-[32px] border border-(--border-color) shadow-2xl backdrop-blur-sm">
        
        {/* Image Section */}
        <div className="overflow-hidden rounded-2xl bg-transparent h-[400px] md:h-[500px]">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${product.imageUrl}`}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 duration-500"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <span className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-2">
            {product.category?.name || "Premium Collection"}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-(--text-color) mb-4 italic uppercase">
            {product.name}
          </h1>
          
          <p className="text-(--text-color) opacity-80 leading-relaxed mb-6 text-lg">
            {product.description}
          </p>

          <div className="mb-8">
            <span className="text-4xl font-black text-(--text-color)">
              {product.price} <span className="text-lg text-yellow-500">EGP</span>
            </span>
          </div>

          {/* Cart Actions Area */}
          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-6">
              {/* Quantity Selector */}
              <div className="flex items-center bg-transparent rounded-xl p-1 border border-(--border-color)">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity === 0 || isAdding}
                  className="p-3 hover:bg-(--border-color) rounded-lg text-(--text-color) disabled:opacity-30 transition-all"
                >
                  <FiMinus />
                </button>
                <span className="w-12 text-center font-bold text-xl text-(--text-color)">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  disabled={product.stock === 0 || isAdding}
                  className="p-3 hover:bg-(--border-color) rounded-lg text-(--text-color) disabled:opacity-30 transition-all"
                >
                  <FiPlus />
                </button>
              </div>

              <div className="text-sm">
                <p className={product.stock > 0 ? "text-green-500" : "text-red-500"}>
                  ● {product.stock > 0 ? `${product.stock} items available` : "Out of stock"}
                </p>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={() => handleQuantityChange("increment")}
              disabled={product.stock === 0 || isAdding}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-(--border-color) disabled:text-(--text-color) uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              <FiShoppingCart size={20} />
              {quantity > 0 ? "Add More to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
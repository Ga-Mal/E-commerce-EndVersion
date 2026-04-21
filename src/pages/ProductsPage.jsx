import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { NavLink } from "react-router-dom"; // تأكد من المسار الصحيح
import API_ENDPOINTS from "../config/apiConfig";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // سحب البيانات والوظائف من الكونتكست
  const { cart, addToCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.PRODUCTS,
          { signal: controller.signal },
        );

        const data = await res.json();
        setProducts(data);

        const uniqueCategories = [ "all", ...new Set(data.map((p) => p.category?.name)) ];
        setCategories(uniqueCategories);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const filteredProducts = activeCategory === "all" ? products : products.filter((p) => p.category?.name === activeCategory);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="pt-20 px-4 max-w-7xl mb-5 mx-auto">
      {/* Categories */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {categories.map((cat, index) => (
          <p
            key={index}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 md:px-4 py-1 md:py-2 cursor-pointer hover:opacity-80 rounded-full text-sm font-bold transition ${
              activeCategory === cat ? "bg-(--primary-color) text-white" : "bg-(--border-color) text-(--text-color)"
            }`}>
            {cat}
          </p>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => {
          
          // --- الجزء المعدل: حساب الكمية لكل منتج داخل الـ map ---
          const cartItem = cart?.items?.find((i) => i.productId === product.id);
          const qty = cartItem?.quantity || 0;
          // --------------------------------------------------

          return (
            <div
              key={product.id}
              className="bg-(--border-color) rounded-2xl shadow-md overflow-hidden flex flex-col">
              {/* Image */}
              <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${product.imageUrl}`} alt={product.name}
                className="h-40 w-full object-cover"
              />

              <div className="p-4 flex flex-col gap-2 flex-1">
                <h2 className="font-bold text-sm line-clamp-2">{product.name}</h2>

                <p className="text-xs opacity-70 line-clamp-2">
                  {product.description}
                </p>

                <p className="font-bold text-sm mt-1">{product.price} EGP</p>

                {/* Status */}
                <span
                  className={`text-xs px-2 py-1 rounded-full w-fit ${
                    product.stock > 5 ? "bg-green-500/20 text-green-600" : product.stock > 0 ? "bg-yellow-500/20 text-yellow-600" : "bg-red-500/20 text-red-600"
                  }`}>
                  {product.stock > 5 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out"}
                </span>

                {/* Button Section */}
                <div className="mt-auto  md:flex items-center justify-between gap-2">
                  {/* Counter */}
                  <div className="flex items-center justify-between gap-2 my-2">
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-(--primary-color) cursor-pointer hover:scale-105 duration-150 text-white px-3 py-1 rounded-lg"
                    >
                      +
                    </button>

                    <span className="font-bold">{qty}</span>

                    <button
                      onClick={() => {
                        if (qty > 1) {
                          updateQuantity(product.id, qty - 1);
                        } else {
                          removeItem(product.id);
                        }
                      }} // دالة الحذف أو تقليل الكمية
                      disabled={qty === 0}
                      className={`px-3 py-1 rounded-lg ${qty === 0 ? "bg-(--border-color) opacity-50 cursor-not-allowed text-(--text-color)" : "bg-red-500 text-white cursor-pointer"}`}
                    >
                      -
                    </button>
                  </div>

                  {/* Show Button */}
                  <NavLink to={`/products/${product.id}`}
                    className="bg-(--primary-color) cursor-pointer block text-center hover:scale-105 duration-150 text-white px-3 py-1 rounded-xl text-lg">
                    Show
                  </NavLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty */}
      {filteredProducts.length === 0 && (
        <p className="text-center mt-10 opacity-70">No products found</p>
      )}
    </div>
  );
}

export default ProductsPage;


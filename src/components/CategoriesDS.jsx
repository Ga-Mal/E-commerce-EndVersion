import { useEffect, useState } from "react";
import toast from "react-hot-toast/headless";
import API_ENDPOINTS from "../config/apiConfig";

function CategoriesDS() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch Categories
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          API_ENDPOINTS.CATEGORIES,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error("Failed to fetch categories");
        
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, []);
  
  // 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(API_ENDPOINTS.ADD_CATEGORY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: categoryName }),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create category");
      }

      const data = await res.json();

      setCategories((prev) => [...prev, data]);
      setCategoryName("");
      setIsModalOpen(false);

      toast.success("Category created successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this category?")) return;
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(API_ENDPOINTS.CATEGORY_BY_ID(id), {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    });

    if (!res.ok) throw new Error("Failed to delete category");

    // Update UI
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success("Deleted Successfully");
  } catch (err) {
    toast.error(err.message);
  }
  };

  const handleUpdate = async (id, currentName) => {
    const newName = window.prompt("Enter the new name for the category:", currentName);
    if (!newName || newName === currentName) return;

    const token = localStorage.getItem("token");  
    try {
      const res = await fetch(API_ENDPOINTS.CATEGORY_BY_ID(id), {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) throw new Error("Failed to update category");

      // تحديث الاسم في الـ State
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, name: newName } : cat))
      );
      toast.success("Category updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">Categories</h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-(--primary-color) text-white cursor-pointer px-4 py-2 rounded-xl text-sm hover:scale-105 transition">
          + Add Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-(--border-color) rounded-2xl shadow-md p-5 flex justify-between items-center">
            {/* Name */}
            <h3 className="font-bold text-lg">{cat.name}</h3>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => handleUpdate(cat.id, cat.name)} className="bg-blue-600 hover:bg-blue-600/50 duration-300 text-white cursor-pointer px-3 py-1 rounded-lg text-sm">
                Edit
              </button>

              <button onClick={() => handleDelete(cat.id)} className="bg-red-600 hover:bg-red-600/50 duration-300 text-white cursor-pointer px-3 py-1 rounded-lg text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <p className="text-center opacity-70 mt-10">No categories found</p>
      )}

      {/* Modal To Add Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-(--secondary-color) text-(--text-color) rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-(--border-color) flex justify-between items-center">
              <h2 className="text-xl font-bold text-(--text-color)">Add New Category</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 hover:text-red-800 hover:cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text-color) opacity-80 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-(--border-color) bg-transparent rounded-lg text-(--text-color) outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 cursor-pointer py-2 bg-(--border-color) text-(--text-color) hover:opacity-80 rounded-lg font-medium">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 cursor-pointer py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesDS;

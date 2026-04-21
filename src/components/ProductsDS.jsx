import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ProductsDS() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    stock: 0,
  });

  const BASE_URL = "https://gemystore.runasp.net/api/Product";
  const CAT_URL = "https://gemystore.runasp.net/api/Category/Get All Category";
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${BASE_URL}/Products`),
        fetch(CAT_URL)
      ]);
      if (!prodRes.ok || !catRes.ok) throw new Error("Fetch failed");
      setProducts(await prodRes.json());
      setCategories(await catRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId || "", 
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", price: "", description: "", categoryId: "", stock: 10 });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      
      data.append("name", formData.name);
      data.append("price", parseInt(formData.price)); 
      data.append("description", formData.description);
      data.append("stock", parseInt(formData.stock)); 
      data.append("categoryId", formData.categoryId);

      // Only append the image if a new file is selected (for both add and edit)
      if (selectedFile) {
        data.append("image", selectedFile); 
      }
      const url = editingProduct ? `${BASE_URL}/${editingProduct.id}` : `${BASE_URL}/AddProduct`;
        
      const method = editingProduct ? "PUT" : "POST"; 

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        // Read error response and extract message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid data. Please check your inputs, The Image Path Must Be jpg Or png ",
          confirmButtonText: "OK",
        })
        console.error("Validation Errors:", errorResponse);
        
        const errorMessage = errorResponse.errors ? Object.values(errorResponse.errors).flat()[0] : (errorResponse.message || "حدث خطأ أثناء حفظ البيانات");
        
        throw new Error(errorMessage);
      }

      await loadData(); // ‘Update the product list after add/edit
      Swal.fire({
        icon: "success",
        title: editingProduct ? "Updated" : "Added",
        text: "Product saved successfully",
        timer: 1500,
        showConfirmButton: false
      });
      closeModal();
    } catch (error) {
      Swal.fire("Error: ", error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    // 1. Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    // 2. If user confirmed, proceed with deletion
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL}/${id}`, {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete the product");
        }

        // 3. Update the UI state immediately
        setProducts((prev) => prev.filter((product) => product.id !== id));

        // 4. Show success message
        Swal.fire({
          title: "Deleted!",
          text: "The product has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

      } catch (err) {
        // 5. Show error message if API fails
        Swal.fire("Error!", err.message, "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-20 text-(--text-color)">Loading...</p>;

  return (
    <div className="p-2 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-[15px] md:text-2xl">Inventory Management</h2>
        <button onClick={() => openModal()} className="bg-(--primary-color) text-[15px] md:text-[20px] md:px-6 md:py-2 rounded-lg hover:bg-purple-700 cursor-pointer font-bold transition">
          + New Product
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="bg-(--secondary-color) rounded-2xl overflow-hidden border border-(--border-color) flex flex-col shadow-lg">
            <img 
              src={`https://gemystore.runasp.net${product.imageUrl}`} 
              alt={product.name} 
              className="h-48 w-full object-cover bg-transparent" 
            />
            <div className="p-5 flex flex-col flex-1">
              <span className="text-xs text-purple-500 font-bold uppercase">{product.category?.name}</span>
              <h3 className="font-bold text-lg text-(--text-color) mt-1">{product.name}</h3>
              <p className="text-(--text-color) opacity-70 text-sm line-clamp-2 my-2">{product.description}</p>
              <p className="text-(--text-color) font-semibold"> Stock: <span className={`font-bold text-lg ${product.stock >= 20 ? 'text-green-500' : product.stock >= 10 ? 'text-yellow-500' : 'text-red-500'}  mt-1`}>{product.stock}</span></p>
              
              <div className="mt-auto pt-4 border-t border-(--border-color) flex justify-between items-center">
                <span className="font-bold text-green-400">{product.price} EGP</span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(product)} className="flex-1 bg-blue-600/10 text-blue-400 border border-blue-600/30 py-2 px-2 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition cursor-pointer">Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 bg-red-600/10 text-red-400 border border-red-600/30 px-2 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition cursor-pointer">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 text-(--text-color) flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-(--secondary-color) rounded-2xl w-full max-w-lg border border-(--border-color) shadow-2xl">
            <div className="p-2 px-4 border-b border-(--border-color) flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingProduct ? "Edit" : "Add"} Product</h2>
              <button onClick={closeModal} className="text-2xl cursor-pointer hover:scale-120 duration-200 text-red-500">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-(--text-color) opacity-80 mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required 
                  className="w-full p-2.5 bg-transparent border border-(--border-color) rounded-lg outline-none focus:border-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-(--text-color) opacity-80 mb-1">Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required 
                    className="w-full p-2.5 bg-transparent border border-(--border-color) rounded-lg outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-sm text-(--text-color) opacity-80 mb-1">Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required 
                    className="w-full p-2.5 bg-transparent border border-(--border-color) rounded-lg outline-none focus:border-purple-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-(--text-color) opacity-80 mb-1">Category</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required 
                  className="w-full p-2.5 bg-transparent border border-(--border-color) rounded-lg outline-none focus:border-purple-500 cursor-pointer">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-(--text-color) opacity-80 mb-1">Product Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} 
                  className="w-full text-sm text-(--text-color) opacity-80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer" />
              </div>

              <div>
                <label className="block text-sm text-(--text-color) opacity-80 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" 
                  className="w-full p-2.5 bg-transparent border border-(--border-color) rounded-lg outline-none focus:border-purple-500 resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2 bg-(--border-color) text-(--text-color) rounded-lg cursor-pointer hover:scale-105 duration-200">Cancel</button>
                <button type="submit" disabled={submitting} className="px-8 py-2 bg-purple-600 text-white rounded-lg font-bold hover:scale-105 duration-200 disabled:opacity-50 cursor-pointer">
                  {submitting ? "Processing..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsDS;
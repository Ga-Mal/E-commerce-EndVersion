import { useEffect, useState } from "react";
import { FiStar, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import API_ENDPOINTS from "../config/apiConfig";

export default function ReviewsDS() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.FEEDBACK, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch Feedbacks");
      const data = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      Swal.fire("Error!", "Failed to load feedbacks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      try {
        const res = await fetch(`${API_ENDPOINTS.FEEDBACK}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to delete feedback");

        setFeedbacks((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "Feedback has been removed.", "success");
      } catch (error) {
        Swal.fire("Error!", error.message, "error");
      }
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) return <div className="text-center py-20 opacity-70">Loading feedbacks...</div>;

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-center text-2xl font-extrabold mb-10 uppercase tracking-widest text-(--text-color) border-b border-(--primary-color) w-fit mx-auto pb-2">
        Customer Feedbacks
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.length > 0 ? (
          feedbacks.map((item) => (
            <div
              key={item.id}
              className="relative p-6 rounded-2xl shadow-lg border border-gray-700 bg-gray-900/80 flex flex-col items-center justify-between hover:border-yellow-500/50 transition-all duration-300"
            >
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-3 right-3 text-red-500 hover:scale-120 duration-200 cursor-pointer"
                title="Delete Feedback"
              >
                <FiTrash2 size={18} />
              </button>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(item.rate || 5)].map((_, i) => (
                  <FiStar key={i} className="fill-yellow-400 text-yellow-400 text-sm" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-300 mb-4 italic text-center">
                "{item.comment}"
              </p>

              {/* User Name & Email */}
              <div className="mt-auto pt-3 border-t border-(--primary-color) w-full text-center">
                <h5 className="text-xs font-bold tracking-wider uppercase text-gray-200">
                  {item.name || item.userName || "Customer"}
                </h5>
                {item.email && <p className="text-[10px] text-gray-500">{item.email}</p>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No feedbacks yet.</p>
        )}
      </div>
    </section>
  );
}
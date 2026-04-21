import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import API_ENDPOINTS from "../config/apiConfig";

export default function Reviews() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.FEEDBACK, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        if (res.status === 401) return; // Silent fail for visitors
        throw new Error("Failed to fetch feedbacks");
      }
      const data = await res.json();
      // Filter to show only feedbacks that the admin has marked as visible
      const visibleFeedbacks = Array.isArray(data) ? data.filter(item => item.isVisible !== false) : [];
      setFeedbacks(visibleFeedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) return null;
  if (feedbacks.length === 0) return null;

  const displayFeedbacks = feedbacks.slice(0, 3);
  // console.log(displayFeedbacks);

  return (
    <section className="py-7 w-[95%] md:py-10 px-6 max-w-7xl mx-auto">
      <h2 className="text-center text-2xl md:text-4xl font-extrabold mb-8 md:mb-16 uppercase tracking-widest">
        Our Community
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {displayFeedbacks.map((item) => (
          <div
            key={item.id}
            className=" p-10 rounded-[40px] shadow-2xl border border-yellow-400 text-center flex flex-col items-center">
            <div className="flex gap-1 mb-6">
              {[...Array(item.rate || 5)].map((_, i) => (
                <FiStar key={i} className="fill-yellow-400 text-yellow-400 text-2xl" />
              ))}
            </div>
            <p className=" text-lg mb-8 leading-relaxed italic">
              "{item.comment}"
            </p>
            <h5 className="font-black tracking-widest uppercase mt-auto">
               {item.name || item.userName || "Customer"}
            </h5>
          </div>
        ))}
      </div>
    </section>
  );
}

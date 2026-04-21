import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";

export default function Reviews() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("https://gemystore.runasp.net/api/Feedback", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch feedbacks");
      }
      const data = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) return null; // Don't show anything while loading on the home page
  if (feedbacks.length === 0) return null; // Don't show section if no feedbacks

  // Optionally limit to top 3 or latest 3 feedbacks for the home page
  const displayFeedbacks = feedbacks.slice(0, 3);

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
               {item.userName || "Customer"}
            </h5>
          </div>
        ))}
      </div>
    </section>
  );
}

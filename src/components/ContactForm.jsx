import { useState } from "react";
import { FiInstagram, FiMail, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    message: "",
    rate: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const loadingToast = toast.loading("Sending feedback...");

    try {
      const response = await fetch("https://gemystore.runasp.net/api/Feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          userName: form.name,
          comment: form.message,
          rate: Number(form.rate),
          rating: Number(form.rate)
        })
      });

      if (response.ok) {
        setForm({ name: "", message: "", rate: 5 });
        toast.success("Feedback sent successfully! 💜", { id: loadingToast });
      } else {
        throw new Error("Failed to send feedback");
      }
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  return (
    <section id="contact" className="py-24 px-6 w-[95%] max-w-7xl mx-auto">
      <div className="flex flex-col items-center md:flex-row gap-20">
        <div className="md:w-1/3 text-center flex flex-col items-center md:text-left">
          <img
            className="rounded-2xl mb-8 shadow-lg"
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="img"
          />
          <div className="flex justify-center md:justify-start gap-6 ">
            <FiInstagram
              size={28}
              className="cursor-pointer hover:scale-110 transition-transform"
            />
            <FiMail
              size={28}
              className="cursor-pointer hover:scale-110 transition-transform"
            />
          </div>
        </div>

        <div className="md:w-2/3">
          <form className="grid grid-cols-1 gap-8" onSubmit={submitForm}>
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-[15px] font-black uppercase tracking-widest text-(--text-color) ml-4">
                  Full Name
                </label>
                <input 
                  id="name"
                  onChange={handleChange}
                  name="name"
                  value={form.name}
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-transparent font-bold text-(--text-color) border border-(--border-color) rounded-2xl px-6 py-5 shadow-inner focus:ring-2 focus:ring-purple-600 outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[15px] font-black uppercase tracking-widest text-(--text-color) ml-4">
                Rate your experience
              </label>
              <div className="flex gap-2 ml-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={28}
                    onClick={() => setForm({ ...form, rate: star })}
                    className={`cursor-pointer transition-all ${star <= form.rate ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-[15px] font-black uppercase tracking-widest text-(--text-color) ml-4">
                Your Feedback
              </label>
              <textarea
                id="message"
                onChange={handleChange}
                name="message"
                value={form.message}
                rows="6"
                placeholder="Tell us what you think..."
                className="w-full bg-transparent border border-(--border-color) text-(--text-color) rounded-3xl px-6 py-5 shadow-inner focus:ring-2 focus:ring-purple-600 outline-none"
                required></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-(--primary-color) text-white btn md:w-[50%] font-black py-2! shadow-2xl uppercase tracking-[0.2em] md:text-[25px]!">
                Send Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}



import { useState } from "react";
import { FiMail, FiPhone, FiGithub, FiLinkedin } from "react-icons/fi";

function ContactPage() {
  const team = [
    {
      name: "Gamal Abdelfattah",
      role: "Frontend Developer",
      email: "gamalabdelfattah098@gmail.com",
      phone: "01227814356",
      github: "https://github.com/Ga-Mal",
      linkedin: "https://www.linkedin.com/in/ga-mal-34781129b/",
    },
    {
      name: "Gamal Elnagar",
      role: "Backend Developer",
      email: "gamalelnagar@email.com",
      phone: "012802400172",
      github: "#",
      linkedin:
        "https://www.linkedin.com/in/gamal-elnagar-292939382?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    },
  ];

  // 1. حالات إدارة البيانات والتحميل والرسائل (State Management)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  // تحديث القيم عند الكتابة
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. معالجة الإرسال بواسطة fetch والتحقق من الحقول
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من الحقول (Validation)
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ loading: false, success: false, error: "يرجى ملء جميع الحقول المطلوبة." });
      return;
    }

    setStatus({ loading: true, success: null, error: null });

    try {
      // إرسال البيانات كـ JSON لـ FormSubmit
      const response = await fetch("https://formsubmit.co/ajax/gamalabdelfattah098@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: "New Contact Message From GMS Store",
          _template: "table",
          _captcha: "false",
        }),
      });

      if (response.ok) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: "", email: "", message: "" }); // تفريغ الفورم بعد النجاح
      } else {
        throw new Error("حدث خطأ أثناء إرسال الرسالة.");
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message || "عفواً، تعذر الإرسال حالياً." });
    }
  };

  return (
    <div className="w-[90%] pt-20 px-4 max-w-7xl mb-5 mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8">Contact Our Team</h1>

      {/* Team Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-(--border-color) rounded-2xl shadow-md p-6 flex flex-col items-center text-center gap-3 hover:scale-105 transition">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-(--primary-color) flex items-center justify-center text-white text-2xl font-bold">
              {member.name.charAt(0)}
            </div>

            {/* Info */}
            <h2 className="font-bold text-lg">{member.name}</h2>
            <p className="text-sm opacity-70">{member.role}</p>

            {/* Contact */}
            <div className="text-sm space-y-1">
              <p className="flex items-center gap-2 justify-center">
                <FiMail /> {member.email}
              </p>
              <p className="flex items-center gap-2 justify-center">
                <FiPhone /> {member.phone}
              </p>
            </div>

            {/* Social - تم إضافة rel="noopener noreferrer" للأمان */}
            <div className="flex gap-4 mt-3 text-lg">
              <a href={member.github} target="_blank" rel="noopener noreferrer">
                <FiGithub className="hover:text-black transition" />
              </a>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <FiLinkedin className="hover:text-blue-600 transition" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="mt-12 bg-(--border-color) p-6 rounded-2xl shadow-md max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Send Message</h2>

        {/* استبدال action بـ onSubmit */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-(--border-color) text-(--text-color) rounded-2xl px-6 py-5 shadow-inner focus:ring-2 focus:ring-purple-600 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-(--border-color) text-(--text-color) rounded-2xl px-6 py-5 shadow-inner focus:ring-2 focus:ring-purple-600 outline-none"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-(--border-color) text-(--text-color) rounded-2xl px-6 py-5 shadow-inner focus:ring-2 focus:ring-purple-600 outline-none"></textarea>

          {/* عرض رسالة النجاح أو الخطأ للمستخدم */}
          {status.success && (
            <p className="text-green-500 text-sm text-center font-semibold">
              تم إرسال رسالتك بنجاح! شكراً للتواصل.
            </p>
          )}
          {status.error && (
            <p className="text-red-500 text-sm text-center font-semibold">{status.error}</p>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className="bg-(--primary-color) text-center cursor-pointer py-3 rounded-xl hover:scale-102 transition disabled:opacity-50">
            {status.loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
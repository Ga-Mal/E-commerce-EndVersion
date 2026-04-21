import { useState, useEffect } from "react";
import { Link } from "react-router";


const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    title: "Elegance Meets Style",
    subtitle: "Discover the latest trends in women’s fashion.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
    title: "Your Daily Dose of Glamour",
    subtitle: "Upgrade your wardrobe with our exclusive collection.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    title: "Be Bold. Be Beautiful.",
    subtitle: "Fashion that speaks to your unique personality.",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <section className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-linear-to-t from-black/70 via-transparent to-transparent">
            <h1 className="text-5xl md:text-7xl text-gray-200 font-black  mb-2 tracking-tighter uppercase italic drop-shadow-2xl">
              {slide.title}
            </h1>
            <p className="text-xl hidden md:block md:text-2xl text-gray-200 mb-10 max-w-2xl font-light">
              {slide.subtitle}
            </p>
            <Link
              to="/products"
              className="group relative bg-gray-200 text-black font-bold py-2 px-5 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10">Shop</span>
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}

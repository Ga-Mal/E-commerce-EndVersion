import { useState, useEffect } from "react";
import { Link } from "react-router";


const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    title: "Timeless Elegance",
    subtitle: "Experience luxury fashion that defines your personality.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1964&auto=format&fit=crop",
    title: "Tech Innovation",
    subtitle: "Stay ahead of the curve with our cutting-edge gadget collection.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop",
    title: "Urban Lifestyle",
    subtitle: "Modern essentials for the contemporary urban dweller.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    title: "Premium Accessories",
    subtitle: "The perfect details to complete your sophisticated look.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?q=80&w=2070&auto=format&fit=crop",
    title: "Summer Essentials",
    subtitle: "Fresh trends to keep you cool and stylish all season long.",
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

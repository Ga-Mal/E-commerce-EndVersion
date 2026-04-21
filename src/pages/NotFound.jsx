import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-40 text-center animate-fade-in">
      <div className="relative">
        <h1 className="text-9xl font-black text-(--primary-color) opacity-20 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl md:text-4xl font-bold text-(--text-color) drop-shadow-lg">
            Oops! Page Not Found
          </p>
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <p className="text-(--text-color) opacity-80 max-w-md mx-auto text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-(--primary-color) text-white font-bold rounded-full hover:scale-105 hover:shadow-[0_0_20px_var(--primary-color)] transition-all duration-300 group"
          >
            <HiHome className="text-xl group-hover:rotate-12 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-(--primary-color) rounded-full blur-[100px] opacity-20 -z-10 animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-48 h-48 bg-(--primary-color) rounded-full blur-[120px] opacity-10 -z-10 animate-pulse delay-700"></div>
    </div>
  );
}

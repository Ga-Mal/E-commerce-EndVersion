import { useRouteError, Link } from "react-router-dom";
import { BiRefresh } from "react-icons/bi";
import { HiHome } from "react-icons/hi";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col py-30 items-center justify-center min-h-[80vh] px-6 text-center animate-fade-in">
      <div className="relative  mb-8">
        <h1 className="text-8xl md:text-9xl font-black text-red-500 opacity-20 select-none">
          Error
        </h1>
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <p className="text-2xl md:text-4xl font-bold text-(--text-color) drop-shadow-lg">
            Something Went Wrong!
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <p className="text-(--text-color) opacity-80 mb-2 font-semibold">Error Details:</p>
          <p className="text-red-500 font-mono text-sm break-words bg-black/5 p-3 rounded-lg">
            {error?.statusText || error?.message || "An unexpected error occurred."}
          </p>
        </div>

        <p className="text-(--text-color) opacity-70">
          Don't worry, it's not your fault. You can try refreshing the page or returning to the home screen.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-8 py-3 bg-(--text-color) text-(--bg-color) font-bold rounded-full hover:scale-105 transition-all duration-300"
          >
            <BiRefresh className="text-2xl" />
            Refresh Page
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-(--primary-color) text-white font-bold rounded-full hover:scale-105 hover:shadow-[0_0_20px_var(--primary-color)] transition-all duration-300 group"
          >
            <HiHome className="text-xl group-hover:rotate-12 transition-transform" />
            Go to Home
          </Link>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-red-500 rounded-full blur-[150px] opacity-10 -z-10"></div>
      <div className="fixed bottom-1/3 left-1/4 w-48 h-48 bg-(--primary-color) rounded-full blur-[150px] opacity-10 -z-10"></div>
    </div>
  );
}

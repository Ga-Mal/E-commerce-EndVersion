import "./App.css";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CustomersDS from "./components/CustomersDS";
import CategoriesDS from "./components/CategoriesDS";
import ReviewsDS from "./components/ReviewsDS";
import OrdersDS from "./components/OrdersDS";
import ProductsDS from "./components/ProductsDS";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";

// Main Layout component that wraps the entire application
// Includes global UI elements like Navbar, Footer, and Notification Toaster
function MainLayout() {
  return (
    <>
      {/* Ensures the page scrolls to the top on every route change */}
      <ScrollToTop />
      {/* Global notification container for react-hot-toast */}
      <Toaster position="top-left" reverseOrder={false} />
      <Navbar />
      {/* Dynamic content placeholder for child routes */}
      <Outlet />
      <BackToTop />
      <Footer />
    </>
  );
}

// Router configuration using React Router 7 (createBrowserRouter)
// Defines public and protected routes, including nested dashboard routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // Custom Error Boundary for catching runtime exceptions
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "contact", element: <ContactPage /> },
      { path: "products", element: <ProductsPage /> }, 
      { path: "products/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      
      // Protected Dashboard Routes: Only accessible by users with "Admin" role
      { path: "dashboard", element: <ProtectedRoute requiredRole="Admin" />, 
        children: [
          { path: "", element: <Dashboard />, handle: { title: "Dashboard" }, 
            children: [
              { path: "orders", element: <OrdersDS />, handle: { title: "Orders" } },
              { path: "customers", element: <CustomersDS />, handle: { title: "Customers" } },
              { path: "products", element: <ProductsDS />, handle: { title: "Products" } },
              { path: "categories", element: <CategoriesDS />, handle: { title: "Categories" } },
              { path: "reviews", element: <ReviewsDS />, handle: { title: "Reviews" } }
            ]
          }
        ]
      },
      // Catch-all route for non-existent URLs (404 Page)
      { path: "*", element: <NotFound /> },
    ],
  },
]);

// Root Application Component
export default function App(){
  return (
    // Provides Authentication State globally to the entire app
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

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

// New Auth Imports
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function MainLayout() {
  return (
    <>
      <Toaster position="top-left" reverseOrder={false} />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "contact", element: <ContactPage /> },
      { path: "products", element: <ProductsPage /> }, 
      { path: "products/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      
      // Protected Dashboard Routes
      { 
        path: "dashboard", 
        element: <ProtectedRoute requiredRole="Admin" />, 
        children: [
          {
            path: "",
            element: <Dashboard />, 
            handle: { title: "Dashboard" }, 
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
    ],
  },
]);

export default function App(){
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

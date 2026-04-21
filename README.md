# GMS | Easy Shopping 🛒
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GMS (GMS)** is a high-performance, modern E-commerce platform built using React 19 and Vite. The platform provides a seamless shopping experience with real-time cart updates, secure authentication, and a powerful administrative dashboard for business management.

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Dynamic Catalog**: Browse products with real-time filtering by categories.
- **Detailed Product Views**: Deep-dive into product specifications, stock status, and pricing.
- **Advanced Shopping Cart**: Add, update, and remove items with persistent state.
- **Secure Checkout**: Streamlined checkout process with order placement.
- **User Profiles**: Personalized experience with secure login and registration.
- **Feedback System**: Customers can rate products and leave detailed reviews.

### 🛡️ Admin Management
- **Centralized Dashboard**: A comprehensive interface to monitor business performance.
- **Inventory Control**: Full CRUD operations (Create, Read, Update, Delete) for products.
- **Order Tracking**: Manage customer orders and update shipping statuses in real-time.
- **User Oversight**: Monitor registered customers and their activity.
- **Review Moderation**: Manage and moderate customer feedback.
- **Category Management**: Dynamically organize the store's structure.

### 🎨 Design & UX
- **Modern Aesthetics**: Sleek dark-mode inspired design with vibrant accents.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop screens.
- **Interactive UI**: Smooth animations using CSS transitions and Framer-like effects.
- **Intelligent Feedback**: Integrated toast notifications and modal alerts for all user actions.

---

## 🛠️ Tech Stack

- **Framework**: [React.js 19](https://react.dev/) (Concurrent rendering, Server Components ready)
- **Build Tool**: [Vite](https://vitejs.dev/) (Lightning-fast HMR and bundling)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Utility-first CSS with next-gen performance)
- **Routing**: [React Router 7](https://reactrouter.com/) (Declarative client-side routing)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/) & [SweetAlert2](https://sweetalert2.github.io/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Feather, FontAwesome, HeroIcons)
- **API Communication**: Native Fetch API with optimized error handling.

---

## 📁 Architecture Overview

```bash
src/
├── components/      # UI components (Atomic design approach)
│   ├── dashboard/   # Specialized Admin Dashboard sections
│   └── shared/      # Global components (Navbar, Footer, ErrorBoundary)
├── config/          # API endpoints and environment configurations
├── context/         # Centralized state management (Auth, Cart)
├── pages/           # Route-level components and page layouts
├── utils/           # Helper utilities and shared logic
└── App.jsx          # Router configuration and global provider wrapping
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ga-Mal/E-commerce-EndVersion.git
   cd E-commerce-EndVersion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://gemystore.runasp.net/api
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🛡️ Security & Performance
- **Protected Routes**: Middleware-style routing ensures sensitive areas are only accessible by authorized users.
- **Error Boundaries**: Graceful handling of runtime crashes with a custom Error Page.
- **JWT Authentication**: Secure token-based communication with the backend.
- **Optimized Assets**: Lazy loading and optimized image handling for faster initial paint.

---

## 📧 Contact & Support
Project Link: [https://github.com/Ga-Mal/E-commerce-EndVersion](https://github.com/Ga-Mal/E-commerce-EndVersion)
Live Application: [https://double-gm.vercel.app/](https://double-gm.runasp.net/)

---
*Developed as a Final Project for the 4th Year CS - Dr. Ehab's Course.*

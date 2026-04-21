const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_ENDPOINTS = {
  // Auth & Users
  LOGIN: `${API_BASE_URL}/Account/Login`,
  REGISTER: `${API_BASE_URL}/Account/Register`,
  USERS: `${API_BASE_URL}/Account/AllUsers`,
  DELETE_USER: (id) => `${API_BASE_URL}/Account/DeleteUser?id=${id}`,

  // Products
  PRODUCTS: `${API_BASE_URL}/Product/Products`,
  ADD_PRODUCT: `${API_BASE_URL}/Product/AddProduct`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/Product/${id}`,

  // Categories
  CATEGORIES: `${API_BASE_URL}/Category/Get All Category`,
  ADD_CATEGORY: `${API_BASE_URL}/Category/AddCategory`,
  CATEGORY_BY_ID: (id) => `${API_BASE_URL}/Category/${id}`,

  // Orders
  ORDERS: `${API_BASE_URL}/Orders/AllOrders`,
  ORDER_STATUS: (id, status) => `${API_BASE_URL}/Orders/${id}/StatusOrder?status=${status}`,
  CHECKOUT: `${API_BASE_URL}/Orders/Checkout->Create-Order`,

  // Cart
  MY_CART: `${API_BASE_URL}/Cart/MyCart`,
  ADD_TO_CART: (productId, quantity) => `${API_BASE_URL}/Cart/add-item-to-cart?productId=${productId}&quantity=${quantity}`,
  UPDATE_CART: (productId, quantity) => `${API_BASE_URL}/Cart/update-item-in-cart?productId=${productId}&newQuantity=${quantity}`,
  REMOVE_FROM_CART: (productId) => `${API_BASE_URL}/Cart/remove-item-from-cart?productId=${productId}`,
  CLEAR_CART: `${API_BASE_URL}/Cart/clear`,

  // Feedback
  FEEDBACK: `${API_BASE_URL}/Feedback`,
};

export default API_ENDPOINTS;

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FiPrinter } from "react-icons/fi";
import API_ENDPOINTS from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";

export const styleBtnStatus = 'text-white px-2 py-1 text-[18px] rounded-xl cursor-pointer hover:scale-105 transition';

function OrdersDS() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.ORDERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        Swal.fire("Session Expired", "Please login again to continue.", "warning");
        logout();
        return;
      }

      if (!res.ok) {
        const errorData = await res.text();
        console.error(`Server Error (${res.status}):`, errorData);
        throw new Error(`Failed to fetch orders (Status ${res.status})`);
      }

      const data = await res.json();
      
      // Ensure we have an array
      const ordersArray = Array.isArray(data) ? data : (data.data || []);
      setOrders(ordersArray);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    const loadingSwal = Swal.fire({
      title: "Updating status...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const res = await fetch(API_ENDPOINTS.ORDER_STATUS(orderId, newStatus), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update status");
      }
      
      // Update local state without fetching all orders again
      setOrders(prevOrders => 
        prevOrders.map(order => 
          (order.id === orderId || order.orderId === orderId) 
            ? { ...order, status: newStatus, orderStatus: newStatus } 
            : order
        )
      );
      Swal.fire("Success", `Status updated to ${newStatus}`, "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", `Update failed: ${err.message}`, "error");
    }
  };

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const items = order.items || order.orderItems || [];
    const total = order.total || order.totalAmount || order.totalPrice || order.subTotal || 0;
    const customerName = order.customer?.name || order.userName || order.email || "Unknown Customer";
    const email = order.customer?.email || order.email || "No Email";
    const phone = order.customer?.phone || order.phoneNumber || order.phone || "No Phone";
    const address = order.address || "No Address";
    const city = order.city || "No City";

    const content = `
      <html>
        <head>
          <title>Order #${order.id || order.orderId}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #7c3aed; margin: 0; font-size: 2.5em; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .info-section h3 { border-bottom: 1px solid #eee; padding-bottom: 10px; color: #4b5563; text-transform: uppercase; font-size: 0.9em; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f9fafb; text-align: left; padding: 12px; border-bottom: 2px solid #eee; color: #4b5563; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .total-section { margin-top: 30px; text-align: right; border-top: 2px solid #7c3aed; padding-top: 20px; }
            .total-amount { font-size: 1.5em; font-weight: bold; color: #7c3aed; }
            .footer { margin-top: 50px; text-align: center; font-size: 0.9em; color: #9ca3af; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { padding: 0; }
              .invoice-box { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <h1>INVOICE</h1>
                <p>Order #${order.id || order.orderId}</p>
              </div>
              <div style="text-align: right">
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.status || order.orderStatus || 'Pending'}</p>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-section">
                <h3>Customer Details</h3>
                <p><strong>${customerName}</strong></p>
                <p>${email}</p>
                <p>${phone}</p>
              </div>
              <div class="info-section">
                <h3>Shipping Address</h3>
                <p>${city}</p>
                <p>${address}</p>
              </div>
            </div>

            <div class="info-section">
              <h3>Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th style="text-align: center">Qty</th>
                    <th style="text-align: right">Price</th>
                    <th style="text-align: right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(item => `
                    <tr>
                      <td>${item.name || item.productName}</td>
                      <td style="text-align: center">${item.qty || item.quantity}</td>
                      <td style="text-align: right">${item.price || item.unitPrice || item.productPrice} EGP</td>
                      <td style="text-align: right">${(item.price || item.unitPrice || item.productPrice) * (item.qty || item.quantity)} EGP</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="total-section">
              <p>Subtotal: ${total} EGP</p>
              <p class="total-amount">Total: ${total} EGP</p>
            </div>

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>This is a computer generated invoice.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => (order.status || order.orderStatus || "Pending").toLowerCase() === filter.toLowerCase());

  const filterOptions = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center bg-black/10 p-2 rounded-2xl border border-white/5">
        {filterOptions.map(opt => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all cursor-pointer ${
              filter === opt 
              ? "bg-(--primary-color) text-white shadow-lg shadow-(--primary-color)/20" 
              : "text-(--text-color) opacity-60 hover:opacity-100 hover:bg-white/5"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center mt-10 opacity-70">No {filter !== 'all' ? filter : ''} orders found.</p>
      ) : (
        <div className="grid gap-4 mb-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order, index) => {
        // Robust mapping to handle different possible backend schemas
        const id = order.id || order.orderId || index;
        const status = order.status || order.orderStatus || "Pending";
        const items = order.items || order.orderItems || [];
        const total = order.total || order.totalAmount || order.totalPrice || order.subTotal || 0;
        
        // Customer details mapping
        const customerName = order.customer?.name || order.userName || order.email || "Unknown Customer";
        const email = order.customer?.email || order.email || "No Email";
        const phone = order.customer?.phone || order.phoneNumber || order.phone || "No Phone";
        const address = order.address || "No Address";
        const city = order.city || "No City";

        return (
          <div key={id} className="bg-(--border-color) rounded-2xl shadow-lg p-6 flex flex-col gap-2 relative">
            {/* Print Button (Top Right) */}
            <button 
              onClick={() => handlePrint(order)}
              className="absolute top-4 right-4 text-(--primary-color) hover:scale-120 duration-200 cursor-pointer"
              title="Print Order"
            >
              <FiPrinter size={20} />
            </button>

            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 border-white/10 mr-8">
              <div>
                <h2 className="font-bold text-lg">#{id}</h2>
                <p className="text-sm opacity-70"> {items.length} items </p>
              </div>

              {/* Status */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  status.toLowerCase() === "pending" ? "bg-yellow-500/20 text-yellow-600" 
                  : ["paid", "delivered", "shipped", "processing"].includes(status.toLowerCase()) ? "bg-green-500/20 text-green-600"
                  : "bg-red-500/20 text-red-600"
                }`}>
                {status}
              </span>
            </div>

            {/* Products */}
            <div className="space-y-2 py-2">
              {items.map((item, i) => {
                const itemName = item.name || item.productName || `Item ${i+1}`;
                const itemQty = item.qty || item.quantity || 1;
                const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
                
                return (
                  <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-1 opacity-80">
                    <span> {itemName} x {itemQty} </span>
                    <span>{itemPrice * itemQty} EGP</span>
                  </div>
                );
              })}
              {items.length === 0 && <p className="text-xs opacity-50">No items details available</p>}
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span className="text-(--primary-color)">{total} EGP</span>
            </div>

            {/* Customer Info */}
            <div className="bg-black/10 rounded-xl p-4 text-sm mt-3 border border-white/5 space-y-1">
              <p><strong>Name:</strong> {customerName}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Phone:</strong> {phone}</p>
              <p><strong>Location:</strong> {city}, {address}</p>
              {order.paymentMethod && <p><strong>Payment:</strong> {order.paymentMethod}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap mt-4">
              <button 
                onClick={() => handleStatusChange(id, 'Processing')} 
                className={`bg-green-600/20 text-green-500 border border-green-600/30 ${styleBtnStatus} text-sm`}
              > 
                Process 
              </button>
              <button 
                onClick={() => handleStatusChange(id, 'Shipped')} 
                className={`bg-blue-600/20 text-blue-500 border border-blue-600/30 ${styleBtnStatus} text-sm`}
              > 
                Ship 
              </button>
              <button 
                onClick={() => handleStatusChange(id, 'Delivered')} 
                className={`bg-green-800/20 text-green-700 border border-green-800/30 ${styleBtnStatus} text-sm`}
              > 
                Deliver 
              </button>
              <button 
                onClick={() => handleStatusChange(id, 'Cancelled')} 
                className={`bg-red-600/20 text-red-500 border border-red-600/30 ${styleBtnStatus} text-sm`}
              > 
                Cancel 
              </button>
            </div>
            
            {/* Debug (remove later if mapping is perfect) */}
            {/* {typeof order.total === 'undefined' && typeof order.totalAmount === 'undefined' && (
              <p className="text-[9px] text-gray-500 mt-2 break-all">Debug: {Object.keys(order).join(", ")}</p>
            )} */}
          </div>
        );
        })}
      </div>
    )}
  </div>
);
}

export default OrdersDS;
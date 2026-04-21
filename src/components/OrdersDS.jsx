import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const styleBtnStatus = 'text-white px-2 py-1 text-[18px] rounded-xl cursor-pointer hover:scale-105 transition';

function OrdersDS() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://gemystore.runasp.net/api/Orders/AllOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
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
    const toastId = toast.loading("Updating status...");
    
    try {
      const res = await fetch(`https://gemystore.runasp.net/api/Orders/${orderId}/StatusOrder?status=${newStatus}`, {
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
      toast.success(`Status updated to ${newStatus}`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(`Update failed: ${err.message}`, { id: toastId });
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (orders.length === 0) return <p className="text-center mt-10 opacity-70">No orders found.</p>;

  return (
    <div className="grid gap-4 mb-5 md:grid-cols-2 xl:grid-cols-3">
      {orders.map((order, index) => {
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
          <div key={id} className="bg-(--border-color) rounded-2xl shadow-lg p-6 flex flex-col gap-2">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 border-white/10">
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
            {typeof order.total === 'undefined' && typeof order.totalAmount === 'undefined' && (
              <p className="text-[9px] text-gray-500 mt-2 break-all">Debug: {Object.keys(order).join(", ")}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OrdersDS;
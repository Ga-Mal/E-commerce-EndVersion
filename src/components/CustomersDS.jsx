import React, { useEffect, useState } from "react";
import { styleBtnStatus } from "./OrdersDS";
import Swal from "sweetalert2";

function CustomersDS() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://gemystore.runasp.net/api/Account/AllUsers";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setCustomers(data);
      // console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete user!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        // Updated delete endpoint based on common naming conventions
        const res = await fetch(`https://gemystore.runasp.net/api/Account/DeleteUser?id=${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to delete user");

        setCustomers((prev) => prev.filter((user) => user.id !== userId));
        Swal.fire("Deleted!", "User has been removed.", "success");
      } catch (err) {
        Swal.fire("Error!", err.message, "error");
      }
    }
  };

  if (loading) return <div className="text-center p-10 text-white">Loading users...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <div key={customer.id}
            className="bg-(--border-color) rounded-2xl shadow-md p-5 flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg text-purple-400">User Details</h2>
                <h2 className="font-bold text-md mt-1">Name: {customer.userName}</h2>
                <p className="text-sm opacity-70">Email: {customer.email}</p>
              </div>
            </div>

            {/* Info */}
            <div className="text-sm space-y-1">
              <p><strong>ID:</strong> <span className="text-xs opacity-60">{customer.id}</span></p>
              <p><strong>Phone:</strong> {customer.phoneNumber || "Not Provided"}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap mt-2">
              <button 
                disabled={true}
                onClick={() => handleDeleteUser(customer.id)}
                className={`bg-red-600 ${styleBtnStatus}`} 
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomersDS;
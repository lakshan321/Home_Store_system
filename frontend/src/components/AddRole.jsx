import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRole() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplierName: "",
    supUsername: "",
    supEmail: "",
    supPassword: "",
    supMobile: "",
    role: "supplier",
  });

  const [errors, setErrors] = useState({
    supEmail: "",
    supPassword: "",
    supMobile: "",
  });

  const [submitError, setSubmitError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { supEmail: "", supPassword: "", supMobile: "" };

    if (!formData.supEmail.includes("@")) {
      newErrors.supEmail = "Email must contain @";
      valid = false;
    }

    if (formData.supPassword.length < 8) {
      newErrors.supPassword = "Password must be at least 8 characters";
      valid = false;
    }

    if (!/^[0-9]{10}$/.test(formData.supMobile)) {
      newErrors.supMobile = "Mobile number must be exactly 10 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const dataToSubmit = { ...formData };

    try {
      const res = await fetch("/api/addrole/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || "Server error.");
        return;
      }

      setSubmitError(null);
      setShowPopup(true); // Show the success popup

      console.log("Role added successfully:", data);
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/dashboard?tab=roals");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Supplier & Inventory Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Supplier Name</label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="supUsername"
            value={formData.supUsername}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="supEmail"
            value={formData.supEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          {errors.supEmail && <p className="text-red-500 text-sm">{errors.supEmail}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="supPassword"
            value={formData.supPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          {errors.supPassword && <p className="text-red-500 text-sm">{errors.supPassword}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Mobile Number</label>
          <input
            type="text"
            name="supMobile"
            value={formData.supMobile}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          {errors.supMobile && <p className="text-red-500 text-sm">{errors.supMobile}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="supplier"
                checked={formData.role === "supplier"}
                onChange={handleChange}
                className="mr-2"
              />
              Supplier
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="inventoryManager"
                checked={formData.role === "inventoryManager"}
                onChange={handleChange}
                className="mr-2"
              />
              Inventory Manager
            </label>
          </div>
        </div>
        <button type="submit" className="w-full px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white hover:opacity-90 transition duration-300">
          Submit
        </button>
        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
      </form>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-xl font-semibold mb-2">Success!</h3>
            <p>Role added successfully.</p>
            <button
              onClick={handlePopupClose}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

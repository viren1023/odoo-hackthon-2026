import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDriver } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function DriverForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    license_number: "",
    category: "LMV",
    license_expiry_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const dataToSubmit = {
        ...formData,
        uid: user?.id || 1,
      };
      await addDriver(dataToSubmit);
      navigate("/drivers");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add driver. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">

      {/* Page Header */}
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/drivers')} 
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Back to drivers"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Add Driver
          </h1>
          <p className="text-slate-500 mt-1">
            Create a new driver profile.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-medium">
              Driver Name
            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-300 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Contact Number
            </label>

            <input
              type="text"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-300 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              License Number
            </label>

            <input
              type="text"
              name="license_number"
              required
              value={formData.license_number}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-300 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              License Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-300 outline-none"
            >
              <option value="LMV">LMV</option>
              <option value="HMV">HMV</option>
              <option value="Transport">Transport</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              License Expiry Date
            </label>

            <input
              type="date"
              name="license_expiry_date"
              required
              value={formData.license_expiry_date}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-300 outline-none"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">

          <button 
            type="button" 
            onClick={() => navigate('/drivers')} 
            className="px-5 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-500 rounded-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Driver"}
          </button>

        </div>

      </form>

    </div>
  );
}
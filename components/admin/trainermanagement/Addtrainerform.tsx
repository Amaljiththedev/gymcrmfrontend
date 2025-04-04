"use client";

import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DatePicker } from "@/components/ui/date-picker"; // Custom date picker component
import { createTrainer } from "@/src/features/trainers/trainerSlice"; // adjust path accordingly
import PersonIcon from "@mui/icons-material/Person";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function CreateTrainer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state (keys match your TrainerCreateInput interface)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    salary: "",
    salary_credited_date: "",
    joined_date: "",
    photo: null as File | null,
  });

  // Date picker states for the date fields
  const [creditedDate, setCreditedDate] = useState<Date>(new Date());
  const [joinedDate, setJoinedDate] = useState<Date>(new Date());

  // Loading and errors state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate the form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Enter a valid email";
    if (!formData.phone_number.match(/^\+?[1-9]\d{1,14}$/))
      newErrors.phone_number = "Invalid phone number";
    if (!formData.salary || Number(formData.salary) <= 0)
      newErrors.salary = "Salary must be a positive number";
    if (!formData.salary_credited_date)
      newErrors.salary_credited_date = "Salary credited date is required";
    if (!formData.joined_date)
      newErrors.joined_date = "Joined date is required";
    if (!formData.photo) newErrors.photo = "Photo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, photo: "Only image files are allowed" }));
        return;
      }
      setFormData((prev) => ({ ...prev, photo: file }));
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  // Submit handler – dispatch the plain object payload; the thunk converts it internally.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await dispatch(createTrainer(formData) as any).unwrap();
      setLoading(false);
      toast.success("Trainer created successfully!");
      router.push("/admin/trainermanagement");
    } catch (err: any) {
      console.error("Error creating trainer:", err);
      setLoading(false);
      const errorMsg = err.response?.data?.detail || err.message || "An error occurred";
      setErrors((prev) => ({ ...prev, general: errorMsg }));
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-transparent border border-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Create Trainer</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top section: Photo and Personal Information */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32">
                <div className="relative">
                  {formData.photo ? (
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Trainer Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-white">
                      <PersonIcon className="text-white text-5xl" />
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 w-full py-2 bg-red-400 hover:bg-red-500 text-white rounded"
                >
                  Upload Photo
                </button>
                {errors.photo && <p className="mt-1 text-red-400 text-sm">{errors.photo}</p>}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-white rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-white rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <label className="block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full p-2 border border-white rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone_number && <p className="text-red-400 text-sm">{errors.phone_number}</p>}
                </div>
                <div>
                  <label className="block mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 border border-white rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            {/* Bottom section: Employment Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Salary</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full p-2 border border-white rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.salary && <p className="text-red-400 text-sm">{errors.salary}</p>}
              </div>
              <div>
                <label className="block mb-1">Salary Credited Date</label>
                <DatePicker
                  selectedDate={creditedDate}
                  onDateChange={(date: Date) => {
                    setCreditedDate(date);
                    setFormData({ ...formData, salary_credited_date: date.toISOString().split("T")[0] });
                  }}
                />
                {errors.salary_credited_date && <p className="text-red-400 text-sm">{errors.salary_credited_date}</p>}
              </div>
              <div>
                <label className="block mb-1">Joined Date</label>
                <DatePicker
                  selectedDate={joinedDate}
                  onDateChange={(date: Date) => {
                    setJoinedDate(date);
                    setFormData({ ...formData, joined_date: date.toISOString().split("T")[0] });
                  }}
                />
                {errors.joined_date && <p className="text-red-400 text-sm">{errors.joined_date}</p>}
              </div>
            </div>
            {errors.general && <p className="text-center text-red-400">{errors.general}</p>}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push("/admin/trainermanagement")}
                className="py-2 px-4 border border-white rounded text-white hover:bg-red-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-6 bg-red-400 hover:bg-red-500 text-white rounded transition"
              >
                {loading ? "Submitting..." : "Create Trainer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

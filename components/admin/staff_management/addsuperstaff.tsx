"use client";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Badge,
  BadgeDollarSign,
  Calendar,
  Lock,
  Image as LucideImage,
  X,
} from "lucide-react";
import { addSuperStaff } from "@/src/features/staff/staffSlice";
import axios from "axios";

// FormField component
type FormFieldProps = {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
};
function FormField({ label, icon: Icon, children, error, required = false }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-400" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// Input component
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ElementType;
};
function Input({ icon: Icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
      <input
        {...props}
        className={`w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 hover:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          Icon ? "pl-10" : ""
        } ${props.className || ""}`}
      />
    </div>
  );
}

// Select component
type SelectOption = {
  value: string;
  label: string;
};
type SelectProps = {
  label: string;
  icon: React.ElementType;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};
function Select({ label, icon: Icon, options, value, onChange, placeholder, error }: SelectProps) {
  return (
    <FormField label={label} icon={Icon} error={error} required>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white hover:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

function generatePassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  department: "",
  salary: "",
  salaryCreditedDate: "",
  password: "",
  photo: null as File | null,
};

export default function CreateSuperStaff() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get("/staff/departments/");
        setDepartments(response.data);
      } catch (error) {
        setErrors((prev) => ({ ...prev, department: "Failed to load departments" }));
      }
    }
    fetchDepartments();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName) e.firstName = "First name is required";
    if (!formData.lastName) e.lastName = "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    if (!formData.phoneNumber.match(/^\d{10}$/)) e.phoneNumber = "Invalid phone number";
    if (!formData.salary || +formData.salary <= 0) e.salary = "Salary must be positive";
    if (!formData.salaryCreditedDate) e.salaryCreditedDate = "Credited date required";
    if (!formData.department) e.department = "Choose a department";
    if (!formData.password || formData.password.length < 8) e.password = "Password too short";
    if (!formData.photo) e.photo = "Photo required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const dueDate = formData.salaryCreditedDate ? new Date(formData.salaryCreditedDate) : new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    const payload = new FormData();
    payload.append("first_name", formData.firstName);
    payload.append("last_name", formData.lastName);
    payload.append("email", formData.email);
    payload.append("phone_number", formData.phoneNumber);
    payload.append("address", formData.address);
    payload.append("department", formData.department);
    payload.append("salary", formData.salary);
    payload.append("salary_credited_date", formData.salaryCreditedDate);
    payload.append("salary_due_date", dueDate.toISOString().split("T")[0]);
    payload.append("password", formData.password);
    if (formData.photo) payload.append("photo", formData.photo);
    try {
      await dispatch(addSuperStaff(payload)).unwrap();
      toast.success("Super Staff Created 🎉");
      router.push("/admin/staff");
    } catch (err: any) {
      toast.error(err.message || "Failed to create super staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Super Staff</h1>
          <p className="text-gray-300">Add a new super staff member</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First Name" icon={User} error={errors.firstName} required>
              <Input
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </FormField>
            <FormField label="Last Name" icon={User} error={errors.lastName} required>
              <Input
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Email Address" icon={Mail} error={errors.email} required>
            <Input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormField>
          <FormField label="Phone Number" icon={Phone} error={errors.phoneNumber} required>
            <Input
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </FormField>
          <FormField label="Address" icon={MapPin} error={errors.address}>
            <Input
              placeholder="Enter address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </FormField>
          <Select
            label="Department"
            icon={Badge}
            options={departments}
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val })}
            placeholder="Select department"
            error={errors.department}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Salary" icon={BadgeDollarSign} error={errors.salary} required>
              <Input
                type="number"
                placeholder="Enter salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </FormField>
            <FormField label="Salary Day" icon={Calendar} error={errors.salaryCreditedDate} required>
              <Input
                type="date"
                value={formData.salaryCreditedDate}
                onChange={(e) => {
                  setFormData({ ...formData, salaryCreditedDate: e.target.value });
                  setStartDate(e.target.value);
                }}
              />
            </FormField>
          </div>
          <FormField label="Password" icon={Lock} error={errors.password} required>
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Set password for login"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                onClick={() => {
                  const newPass = generatePassword();
                  setFormData({ ...formData, password: newPass });
                  navigator.clipboard.writeText(newPass);
                  toast.success("Password generated & copied 🔐");
                }}
              >
                Suggest
              </button>
            </div>
          </FormField>
          <FormField label="Profile Photo" icon={LucideImage} error={errors.photo} required>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </button>
              <span className="text-gray-300 text-sm">
                {formData.photo ? formData.photo.name : "No file selected"}
              </span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData({ ...formData, photo: e.target.files[0] });
                  }
                }}
              />
            </div>
          </FormField>
          {errors.general && (
            <div className="text-center text-red-400 text-sm">{errors.general}</div>
          )}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200"
              onClick={() => router.push("/admin/staff")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Super Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

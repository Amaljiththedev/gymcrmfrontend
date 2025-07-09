"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchMembershipPlans, createPlan } from "@/src/features/membershipPlans/membershipPlanSlice";
import { useRouter } from "next/navigation";
import { Tag, Calendar, IndianRupee, X } from "lucide-react";

// FormField component (copied from user_management/add_form)
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
// Input component (copied from user_management/add_form)
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
        className={`w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 hover:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${Icon ? 'pl-10' : ''} ${props.className || ''}`}
      />
    </div>
  );
}

export default function PlanCreationForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    durationDays: "",
    price: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const { plans, loading, error } = useSelector((state: RootState) => state.membershipPlans);

  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Plan name is required.";
    if (!formData.durationDays.trim()) newErrors.durationDays = "Duration is required.";
    else if (isNaN(Number(formData.durationDays)) || Number(formData.durationDays) <= 0) newErrors.durationDays = "Duration must be a positive number.";
    if (!formData.price.trim()) newErrors.price = "Price is required.";
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = "Price must be a positive number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const planData = {
      name: formData.name,
      duration_days: Number(formData.durationDays),
      price: Number(formData.price),
    };
    try {
      await dispatch(createPlan(planData)).unwrap();
      router.push("/admin/planmanagement");
    } catch (err: any) {
      setErrors({ ...errors, submit: "Failed to create plan: " + (err?.message || err) });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Existing Plans Sidebar */}
        <div className="md:w-1/3">
          <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl p-6 h-full">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-400" /> Existing Plans
            </h2>
            <p className="text-gray-400 mb-4">Current membership options</p>
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 rounded-md bg-red-900/20 border border-red-800 text-red-200">
                Error loading plans. Please try again.
              </div>
            ) : plans && plans.length > 0 ? (
              <ul className="space-y-2">
                {plans.map((plan) => (
                  <li key={plan.id} className="p-3 border border-gray-700 rounded-md bg-transparent text-white transition-all hover:bg-gray-700">
                    <p className="font-bold">{plan.name}</p>
                    <div className="flex justify-between text-sm text-gray-300 mt-1">
                      <span>{plan.duration_days} days</span>
                      <span className="font-semibold">₹{plan.price}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                <Tag className="h-10 w-10 mb-2 text-gray-600" />
                <p>No plans available yet.</p>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-6">
              <span className="font-semibold text-gray-300">Note:</span> Plan names should be unique and each plan should have different pricing.
            </p>
          </div>
        </div>
        {/* Plan Creation Form */}
        <div className="md:w-2/3">
          <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create New Membership Plan</h1>
              <p className="text-gray-300">Configure your new membership plan details below</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-7">
              <FormField label="Plan Name" icon={Tag} error={errors.name || undefined} required>
                <Input
                  placeholder="Enter unique plan name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </FormField>
              <FormField label="Duration (days)" icon={Calendar} error={errors.durationDays || undefined} required>
                <Input
                  type="number"
                  placeholder="e.g. 30"
                  value={formData.durationDays}
                  onChange={(e) => handleInputChange("durationDays", e.target.value)}
                />
              </FormField>
              <FormField label="Price (₹)" icon={IndianRupee} error={errors.price || undefined} required>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter price amount"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </FormField>
              {errors.submit && (
                <div className="text-red-400 text-center font-medium">{errors.submit}</div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto py-2.5 px-5 text-gray-200 rounded-md shadow-md transition-colors hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Badge,
  BadgeDollarSign,
  Calendar,
  X,
} from 'lucide-react';
import { addRegularStaff } from '@/src/features/staff/staffSlice';
import axios from 'axios';

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
          Icon ? 'pl-10' : ''
        } ${props.className || ''}`}
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
    <FormField label={label} icon={Icon} error={error}>
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

export default function CreateRegularStaff() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    department: '',
    salary: '',
    salaryCreditedDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get('/staff/departments/');
        setDepartments(response.data);
      } catch (error) {
        setErrors((prev) => ({ ...prev, department: 'Failed to load departments' }));
      }
    }
    fetchDepartments();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Please enter a valid email';
    if (!formData.phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) newErrors.phoneNumber = 'Invalid phone number';
    if (!formData.department) newErrors.department = 'Select a department';
    if (Number(formData.salary) <= 0) newErrors.salary = 'Salary must be a positive number';
    if (!formData.salaryCreditedDate) newErrors.salaryCreditedDate = 'Please choose a salary day';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const formPayload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      address: formData.address,
      department: formData.department,
      salary: formData.salary,
      salary_credited_date: formData.salaryCreditedDate,
      salary_credited_day: formData.salaryCreditedDate ? new Date(formData.salaryCreditedDate).getDate() : '',
      salary_due_date: formData.salaryCreditedDate,
      salary_due_date_string: formData.salaryCreditedDate,
      photo: '',
    };
    try {
      await dispatch(addRegularStaff(formPayload)).unwrap();
      setLoading(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        department: '',
        salary: '',
        salaryCreditedDate: '',
      });
      setStartDate('');
      toast.success('Regular staff created successfully!');
      router.push('/admin/staff');
    } catch (err) {
      setLoading(false);
      let errorMsg = 'An unexpected error occurred';
      if (typeof err === 'object' && err !== null) {
        const e = err as any;
        errorMsg = e.response?.data?.detail || e.message || errorMsg;
      }
      setErrors((prev) => ({ ...prev, general: errorMsg }));
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Regular Staff</h1>
          <p className="text-gray-300">Add a new regular staff member</p>
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
          {errors.general && (
            <div className="text-center text-red-400 text-sm">{errors.general}</div>
          )}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200"
              onClick={() => router.push('/admin/staff')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg transform hover:scale-105"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Regular Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

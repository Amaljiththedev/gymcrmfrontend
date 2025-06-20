"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppDispatch } from "@/src/store/store";
import { addSuperStaff } from "@/src/features/staff/staffSlice";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  Mail,
  User,
  Phone,
  Home,
  Briefcase,
  DollarSign,
  Calendar,
  Lock,
  Image,
  Loader2,
} from "lucide-react";
import axios from "axios";

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

function generatePassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const CreateSuperStaff = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormState);
  const [startDate, setStartDate] = useState(new Date());
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const dueDate = new Date(startDate);
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

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get("/staff/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments: 😕", error);
        setErrors((prev) => ({ ...prev, department: "Failed to load departments 😕" }));
      }
    }
    fetchDepartments();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <Card className="bg-transparent border border-white/10 shadow-md shadow-white/5 p-4">
        <CardContent className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">Create Super Staff</h2>
            <p className="text-gray-400 mt-1">Fill in the details to create a new Super Staff member</p>
          </div>

          <Separator className="my-4 bg-white/10" />

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Section */}
            <div className="space-y-6 border border-white/10 p-6 rounded-xl bg-black/20">
              <h3 className="text-white text-lg font-semibold">Personal Information</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      className="pl-10 bg-black/40 border-white/20 text-white"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      className="pl-10 bg-black/40 border-white/20 text-white"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 bg-black/40 border-white/20 text-white"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      className="pl-10 bg-black/40 border-white/20 text-white"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Address</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    className="pl-10 bg-black/40 border-white/20 text-white"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Employment */}
            <div className="space-y-6 border border-white/10 p-6 rounded-xl bg-black/20">
              <h3 className="text-white text-lg font-semibold">Employment Details</h3>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">Department</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger className="pl-10 bg-black/40 border-white/20 text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20 text-white">
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-white">Salary</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="salary"
                      type="number"
                      className="pl-10 bg-black/40 border-white/20 text-white"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                  </div>
                  {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditedDate" className="text-white">Salary Credited Date</Label>
                  <div className="relative bg-black/40 border border-white/20 rounded-md">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <div className="pl-10">
                      <DatePicker
                        selectedDate={startDate}
                        onDateChange={(date: Date) => {
                          setStartDate(date);
                          setFormData({
                            ...formData,
                            salaryCreditedDate: date.toISOString().split("T")[0],
                          });
                        }}
                      />
                    </div>
                  </div>
                  {errors.salaryCreditedDate && <p className="text-red-500 text-sm">{errors.salaryCreditedDate}</p>}
                </div>
              </div>
            </div>

            {/* Security & Photo */}
            <div className="space-y-6 border border-white/10 p-6 rounded-xl bg-black/20">
              <h3 className="text-white text-lg font-semibold">Security & Photo</h3>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="text"
                    className="pl-10 pr-32 bg-black/40 border-white/20 text-white"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <Button
                    type="button"
                    className="absolute top-1.5 right-1 bg-white/10 text-white hover:bg-white/20 text-xs px-3 py-1"
                    onClick={() => {
                      const newPass = generatePassword();
                      setFormData({ ...formData, password: newPass });
                      navigator.clipboard.writeText(newPass);
                      toast.success("Password generated & copied 🔐");
                    }}
                  >
                    Suggest
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo" className="text-white">Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-black/40 border-white/20 text-white hover:bg-white/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <span className="text-gray-400 text-sm">
                    {formData.photo ? formData.photo.name : "No file selected"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData({ ...formData, photo: e.target.files[0] });
                      }
                    }}
                  />
                </div>
                {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
              </div>
            </div>

            {/* Footer */}
            <CardFooter className="flex justify-end gap-4 px-0">
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push("/admin/staff")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Super Staff
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSuperStaff;

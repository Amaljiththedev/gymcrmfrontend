"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { DatePicker } from "@/components/ui/date-picker";
import {
  fetchTrainerById,
  updateTrainer,
  clearTrainerError,
  TrainerInput,
  Trainer,
} from "@/src/features/trainers/trainerSlice";
import { RootState, AppDispatch } from "@/src/store/store";
import PersonIcon from "@mui/icons-material/Person";

export default function EditTrainer() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─────────────── Redux state
  const { currentTrainer, currentLoading, currentError } = useSelector(
    (s: RootState) => s.trainers
  );

  // ─────────────── Local Form State
  const [formData, setFormData] = useState<TrainerInput>({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    salary: "",
    salary_credited_date: "",
    joined_date: "",
    is_blocked: false,
    photo: null,
  });

  const [creditedDate, setCreditedDate] = useState<Date>(new Date());
  const [joinedDate, setJoinedDate] = useState<Date>(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─────────────── Fetch trainer on mount
  useEffect(() => {
    dispatch(fetchTrainerById(Number(id)));
    return () => {
      dispatch(clearTrainerError());
    };
  }, [id, dispatch]);

  // ─────────────── Populate form when data loads
  useEffect(() => {
    if (currentTrainer) {
      const t = currentTrainer as Trainer;
      setFormData({
        ...t,
        salary_credited_date: t.salary_credited_date?.split("T")[0],
        joined_date: t.joined_date?.split("T")[0],
        photo: null,
      });
      setCreditedDate(new Date(t.salary_credited_date));
      setJoinedDate(new Date(t.joined_date));
    }
  }, [currentTrainer]);

  // ─────────────── Validation
  const validateForm = () => {
    const err: Record<string, string> = {};
    if (!formData.name) err.name = "Name is required";
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      err.email = "Enter a valid email";
    if (!formData.phone_number?.match(/^\+?[1-9]\d{1,14}$/))
      err.phone_number = "Invalid phone number";
    if (!formData.salary || Number(formData.salary) <= 0)
      err.salary = "Salary must be a positive number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ─────────────── File Picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setErrors((p) => ({ ...p, photo: "Only image files are allowed" }));
        return;
      }
      setFormData((p) => ({ ...p, photo: file }));
      setErrors((p) => ({ ...p, photo: "" }));
    }
  };

  // ─────────────── Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await dispatch(
        updateTrainer({ id: Number(id), payload: formData })
      ).unwrap();
      toast.success("Trainer updated!");
      router.push("/admin/trainermanagement");
    } catch (err: any) {
      toast.error(err || "Update failed");
    }
  };

  // ─────────────── UI
  if (currentLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }
  if (currentError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-400">
        {currentError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-transparent border border-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Trainer</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ───── Photo + Personal */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32">
                <div className="relative">
                  {formData.photo ? (
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                    />
                  ) : currentTrainer?.photo ? (
                    <img
                      src={currentTrainer.photo}
                      alt="Trainer"
                      className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-white">
                      <PersonIcon className="text-white text-5xl" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 w-full py-2 bg-red-400 hover:bg-red-500 rounded"
                >
                  {formData.photo ? "Change Photo" : "Upload Photo"}
                </button>
                {errors.photo && (
                  <p className="mt-1 text-red-400 text-sm">{errors.photo}</p>
                )}
              </div>

              <div className="flex-1 space-y-4">
                {/* Name */}
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    className="w-full p-2 border rounded bg-transparent"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm">{errors.name}</p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded bg-transparent"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>
                {/* Phone */}
                <div>
                  <label className="block mb-1">Phone Number</label>
                  <input
                    className="w-full p-2 border rounded bg-transparent"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                  />
                  {errors.phone_number && (
                    <p className="text-red-400 text-sm">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
                {/* Address */}
                <div>
                  <label className="block mb-1">Address</label>
                  <input
                    className="w-full p-2 border rounded bg-transparent"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* ───── Employment Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Salary */}
              <div>
                <label className="block mb-1">Salary</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-transparent"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                />
                {errors.salary && (
                  <p className="text-red-400 text-sm">{errors.salary}</p>
                )}
              </div>

              {/* Credited date */}
              <div>
                <label className="block mb-1">Salary Credited Date</label>
                <DatePicker
                  selectedDate={creditedDate}
                  onDateChange={(d: Date) => {
                    setCreditedDate(d);
                    setFormData({
                      ...formData,
                      salary_credited_date: d.toISOString().split("T")[0],
                    });
                  }}
                />
              </div>

              {/* Joined date */}
              <div>
                <label className="block mb-1">Joined Date</label>
                <DatePicker
                  selectedDate={joinedDate}
                  onDateChange={(d: Date) => {
                    setJoinedDate(d);
                    setFormData({
                      ...formData,
                      joined_date: d.toISOString().split("T")[0],
                    });
                  }}
                />
              </div>
            </div>

            {/* ───── Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="py-2 px-4 border border-white rounded hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-6 bg-red-400 hover:bg-red-500 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchMembershipPlans, createPlan } from "@/src/features/membershipPlans/membershipPlanSlice";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label2";
import { Input } from "@/components/ui/input1";
import { cn } from "@/lib/utils";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormErrors {
  name?: string;
  durationDays?: string;
  price?: string;
}

export default function PlanCreationForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Get plans from Redux store (for guide display)
  const { plans, loading, error } = useSelector((state: RootState) => state.membershipPlans);

  // Fetch membership plans on mount
  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Plan name is required.";
    }
    if (!durationDays.trim()) {
      newErrors.durationDays = "Duration is required.";
    } else if (isNaN(Number(durationDays)) || Number(durationDays) <= 0) {
      newErrors.durationDays = "Duration must be a positive number.";
    }
    if (!price.trim()) {
      newErrors.price = "Price is required.";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const planData = {
      name,
      duration_days: Number(durationDays),
      price: Number(price),
    };

    try {
      await dispatch(createPlan(planData)).unwrap();
      toast.success("Plan created successfully! 🎉");
      router.push("/admin/planmanagement");
    } catch (err: any) {
      toast.error("Failed to create plan 😢: " + err);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer />
      <Card className="bg-transparent border-gray-800 shadow-xl">
        <CardHeader className="border-b border-gray-800 bg-transparent rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-white text-center">
            Create New Membership Plan
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Configure your new membership plan details below
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Existing Plans Card */}
            <div className="md:w-1/3">
              <Card className="bg-transparent border-gray-700 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">Existing Plans</CardTitle>
                  <CardDescription className="text-gray-400">
                    Current membership options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-24">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No plans available yet.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-transparent border-t border-gray-800 px-4 py-3">
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-300">Note:</span> Plan names should be unique and each plan should have different pricing.
                  </p>
                </CardFooter>
              </Card>
            </div>

            {/* Plan Creation Form */}
            <div className="md:w-2/3">
              <Card className="bg-transparent border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">Plan Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fill in the information for your new plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Plan Name */}
                    <LabelInputContainer>
                      <Label htmlFor="planName" className="text-white">Plan Name</Label>
                      <Input
                        id="planName"
                        name="planName"
                        placeholder="Enter unique plan name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-gray-700 text-white focus:border-red-500 focus:ring-red-500/20"
                      />
                      {errors.name && <small className="text-red-500 font-medium">{errors.name}</small>}
                      <small className="text-gray-400">
                        Ensure the plan name is unique to avoid confusion.
                      </small>
                    </LabelInputContainer>

                    {/* Duration (days) */}
                    <LabelInputContainer>
                      <Label htmlFor="durationDays" className="text-white">Duration (days)</Label>
                      <Input
                        id="durationDays"
                        name="durationDays"
                        type="number"
                        placeholder="e.g. 30"
                        value={durationDays}
                        onChange={(e) => setDurationDays(e.target.value)}
                        className="bg-transparent border-gray-700 text-white focus:border-red-500 focus:ring-red-500/20"
                      />
                      {errors.durationDays && <small className="text-red-500 font-medium">{errors.durationDays}</small>}
                      <small className="text-gray-400">
                        Enter the membership duration in days.
                      </small>
                    </LabelInputContainer>

                    {/* Price */}
                    <LabelInputContainer>
                      <Label htmlFor="price" className="text-white">Price (₹)</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400">₹</span>
                        </div>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          placeholder="Enter price amount"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="bg-transparent border-gray-700 text-white pl-8 focus:border-red-500 focus:ring-red-500/20"
                        />
                      </div>
                      {errors.price && <small className="text-red-500 font-medium">{errors.price}</small>}
                      <small className="text-gray-400">
                        Each plan must have a distinct pricing amount.
                      </small>
                    </LabelInputContainer>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 border-t ">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto py-2.5 px-5  text-gray-200 rounded-md shadow-md transition-colors hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full sm:w-auto py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:outline-none"
                  >
                    Create Plan
                  </button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col space-y-1.5", className)}>{children}</div>;
};
"use client";

import React, { useState, useMemo, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchMembershipPlans } from "@/src/features/membershipPlans/membershipPlanSlice";
import { updateMember } from "@/src/features/members/memberSlice";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import { Label } from "@/components/ui/label2";
import { Input } from "@/components/ui/input1";
import { cn } from "@/lib/utils";
import axios from "axios";
import { User, CreditCard, CheckCircle, Calendar, CalendarDays } from "lucide-react";

// Helper function to compute expiry date
const getExpiryDate = (startDateStr: string, durationDays: number): string => {
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return "";
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + durationDays);
  return expiryDate.toISOString().slice(0, 10);
};

// Helper to get icon for plan name
const getPlanIcon = (planName: string) => {
  switch (planName.toLowerCase()) {
    case "premium":
      return CreditCard;
    case "basic":
      return Calendar;
    default:
      return User;
  }
};

// Helper to format currency
const formatCurrency = (amount: number) => {
  return amount?.toLocaleString("en-IN", { style: "currency", currency: "INR" });
};

export default function EditMemberForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { memberId } = useParams() as { memberId: string };
  const { plans } = useSelector((state: RootState) => state.membershipPlans);

  // -------------------------------
  // Personal Information State
  // -------------------------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  // -------------------------------
  // Membership Details State
  // -------------------------------
  const [membershipStart, setMembershipStart] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [initialPayment, setInitialPayment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  // -------------------------------
  // Health Information State
  // -------------------------------
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dob, setDob] = useState("");

  // Fetch membership plans
  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  // Fetch member details and pre-fill the form
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        // Alternatively, you can dispatch a Redux thunk:
        // const member = await dispatch(fetchMemberById(Number(memberId))).unwrap();
        const response = await axios.get(`http://localhost:8000/api/members/${memberId}/`, {
          withCredentials: true,
        });
        const data = response.data;
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setGender(data.gender || "");
        // Format membership_start to fit an input of type datetime-local
        setMembershipStart(data.membership_start ? data.membership_start.slice(0, 16) : "");
        setInitialPayment(data.amount_paid);
        setHeight(data.height ? String(data.height) : "");
        setWeight(data.weight ? String(data.weight) : "");
        setDob(data.dob || "");
        setSelectedPlan(String(data.membership_plan.id));
        if (data.photo) {
          setPhotoPreview(data.photo);
        }
      } catch (error: any) {
        toast.error("Failed to load member details 😢");
      }
    };

    fetchMemberDetails();
  }, [memberId]);

  // Update photo preview when a new file is selected.
  useEffect(() => {
    if (!photo) {
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // Computed expiry date & duration in months
  const computedExpiryDate = useMemo(() => {
    if (!membershipStart || !selectedPlan) return "";
    const plan = plans.find((p) => String(p.id) === selectedPlan);
    if (!plan) return "";
    return getExpiryDate(membershipStart, plan.duration_days);
  }, [membershipStart, selectedPlan, plans]);

  const computedDurationMonths = useMemo(() => {
    if (!selectedPlan) return "";
    const plan = plans.find((p) => String(p.id) === selectedPlan);
    if (!plan) return "";
    return Math.ceil(plan.duration_days / 30).toString();
  }, [selectedPlan, plans]);

  // Get selected plan data
  const selectedPlanData = useMemo(() => {
    return plans.find((p) => String(p.id) === selectedPlan);
  }, [selectedPlan, plans]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const memberData = new FormData();
    memberData.append("first_name", firstName);
    memberData.append("last_name", lastName);
    memberData.append("email", email);
    memberData.append("phone", phone);
    memberData.append("address", address);
    memberData.append("gender", gender);
    memberData.append("membership_start", membershipStart);
    // Use the key your backend expects (membership_plan_id in this example)
    memberData.append("membership_plan_id", selectedPlan);
    memberData.append("amount_paid", initialPayment);
    if (height) memberData.append("height", height);
    if (weight) memberData.append("weight", weight);
    if (dob) memberData.append("dob", dob);
    if (photo) memberData.append("photo", photo);

    try {
      // Update member via your Redux thunk
      await dispatch(updateMember({ memberId: Number(memberId), memberData })).unwrap();
      toast.success("Member updated successfully! 🎉");
      router.push("/admin/membermanagement");
    } catch (error: any) {
      toast.error("Failed to update member 😢: " + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Membership Renewal</h1>
          <p className="text-purple-200">Extend your fitness journey with us</p>
        </div>

        {/* Member Summary Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {firstName} {lastName}
                </h3>
                <p className="text-purple-200">{email}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-200">Current Plan</div>
              <div className="text-lg font-semibold text-white">{selectedPlanData?.name || "-"}</div>
              <div className="text-sm text-red-300">Expires: {computedExpiryDate ? new Date(computedExpiryDate).toLocaleDateString() : "-"}</div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-900/40 backdrop-blur-lg border border-gray-700/40 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="space-y-8">
                {/* Plan Selection - Apple-like Dropdown */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <CreditCard className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
                  </div>
                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-purple-200 mb-2">Membership Plan</label>
                    <select
                      value={selectedPlan}
                      onChange={e => setSelectedPlan(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white hover:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a plan</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={String(plan.id)}>
                          {plan.name} - {plan.duration_days} days - {formatCurrency(plan.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>
                {/* Membership Details */}
                {selectedPlan && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Calendar className="w-6 h-6 text-purple-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Renewal Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-200 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          Renewal Start Date
                        </label>
                        <input
                          type="datetime-local"
                          value={membershipStart}
                          onChange={(e) => setMembershipStart(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 hover:bg-white/15 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-200 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-purple-400" />
                          Plan Duration
                        </label>
                        <input
                          readOnly
                          value={`${computedDurationMonths} months (${selectedPlanData?.duration_days} days)`}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-gray-300 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-200 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-purple-400" />
                        Membership Expiry Date
                      </label>
                      <input
                        readOnly
                        value={computedExpiryDate}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-gray-300 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-200 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        Payment Amount *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder={`Recommended: ${selectedPlanData?.price}`}
                        value={initialPayment}
                        onChange={(e) => setInitialPayment(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 hover:bg-white/15 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </section>
                )}
                {/* Summary Card */}
                {selectedPlan && initialPayment && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Renewal ready! Please review and submit.
                    </h3>
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#007AFF] hover:bg-[#0056CC] text-white rounded-xl shadow-lg font-semibold text-base transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    Update Member
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-md font-semibold text-base transition-all duration-200 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
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
  return <div className={cn("flex flex-col space-y-2", className)}>{children}</div>;
};
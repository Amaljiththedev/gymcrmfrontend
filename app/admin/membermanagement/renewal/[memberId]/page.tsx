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

// Helper function to compute expiry date
const getExpiryDate = (startDateStr: string, durationDays: number): string => {
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return "";
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + durationDays);
  return expiryDate.toISOString().slice(0, 10);
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
    <div className="mx-auto w-full max-w-3xl p-8 bg-black text-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Member</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 text-white"
            />
          </LabelInputContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded border border-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </LabelInputContainer>
        </section>

        {/* Membership Details */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Membership Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="membershipStart">Membership Start</Label>
              <Input
                id="membershipStart"
                name="membershipStart"
                type="datetime-local"
                value={membershipStart}
                onChange={(e) => setMembershipStart(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="selectedPlan">Membership Plan</Label>
              <select
                id="selectedPlan"
                name="selectedPlan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded border border-gray-700"
              >
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} | {plan.duration_days} days | ₹{plan.price}
                  </option>
                ))}
              </select>
            </LabelInputContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label>Computed Expiry Date</Label>
              <Input
                readOnly
                value={computedExpiryDate}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label>Duration (months)</Label>
              <Input
                readOnly
                value={computedDurationMonths}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer>
            <Label htmlFor="initialPayment">Initial Payment</Label>
            <Input
              id="initialPayment"
              name="initialPayment"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={initialPayment}
              onChange={(e) => setInitialPayment(e.target.value)}
              className="bg-gray-800 text-white"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              name="photo"
              type="file"
              onChange={(e) =>
                setPhoto(e.target.files ? e.target.files[0] : null)
              }
              className="bg-gray-800 text-white"
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Member Photo"
                className="mt-2 max-w-[200px] rounded"
              />
            )}
          </LabelInputContainer>
        </section>

        {/* Health Information */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">Health Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.01"
                placeholder="e.g. 170.00"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.01"
                placeholder="e.g. 65.00"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-gray-800 text-white"
            />
          </LabelInputContainer>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-t from-destructive to-destructive/85 text-destructive-foreground border border-zinc-950/25 shadow-md shadow-zinc-950/20 ring-1 ring-inset ring-white/20 transition duration-200 hover:brightness-110 active:brightness-90 dark:border-white/15 dark:ring-transparent"
          >
            Update Member
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full h-12 bg-gray-700 text-white rounded-md shadow-md transition-colors hover:bg-gray-600 active:bg-gray-500"
          >
            Back
          </button>
        </div>
      </form>
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

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, User, Calendar, Phone, TrendingUp, DollarSign, Activity } from "lucide-react";

// ---------------------------
// Type Definitions
// ---------------------------
interface MembershipPlan {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  is_locked: boolean;
}

interface Member {
  membership_status: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  height?: number;
  weight?: number;
  dob?: string;
  membership_start: string;
  membership_plan: MembershipPlan;
  is_blocked: boolean;
  amount_paid: string;
  membership_end: string;
  is_fully_paid: boolean;
  days_present: number;
  photo?: string;
}

// ---------------------------
// Component
// ---------------------------
export default function MemberView() {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get<Member>(
          `http://localhost:8000/api/members/${memberId}/`,
          { withCredentials: true }
        );
        setMember(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch member details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const calculateProgress = () => {
    if (!member?.membership_start || !member?.membership_end) return 0;
    const start = new Date(member.membership_start).getTime();
    const end = new Date(member.membership_end).getTime();
    const now = new Date().getTime();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const calculateAttendanceRate = () => {
    if (!member) return 0;
    const start = new Date(member.membership_start).getTime();
    const now = new Date().getTime();
    const daysPassed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    if (daysPassed <= 0) return 0;
    return Math.min(100, Math.round((member.days_present / daysPassed) * 100));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-black min-h-screen">
        <h3 className="text-2xl text-red-500">{error}</h3>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-4 bg-black min-h-screen">
        <h3 className="text-2xl text-red-500">Member not found</h3>
      </div>
    );
  }

  const fullName = `${member.first_name} ${member.last_name}`;
  const membershipProgress = calculateProgress();
  const attendanceRate = calculateAttendanceRate();

  return (
    <div className="container mx-auto py-6 px-4 min-h-screen bg-black text-white space-y-6">
      {/* Header with Invoice Download */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-3xl font-bold">{fullName}'s Profile</h1>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0 border border-white/20 hover:border-white/40"
          onClick={() => alert("Downloading Invoice...")}
        >
          <Download className="mr-2 h-4 w-4" /> Download Invoice
        </Button>
      </div>

      <Separator className="border-white/20" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Card */}
        <Card className="col-span-1 bg-transparent shadow-none border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-col items-center">
            {member.photo ? (
              <img
                src={member.photo}
                alt={fullName}
                className="w-24 h-24 rounded-full border-2 border-white/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-10 w-10 text-red-500" />
              </div>
            )}
            <CardTitle className="mt-4 text-center text-white bg-clip-text bg-gradient-to-r from-red-500 to-gray-500">
              {fullName}
            </CardTitle>
            <p className="text-sm text-gray-300">ID: #{member.id}</p>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.membership_status === "blocked"
                    ? "bg-red-800"
                    : member.membership_status === "expired"
                    ? "bg-yellow-800"
                    : "bg-green-800"
                }`}
              >
                {member.membership_status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-300">Membership Progress</p>
              <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-gray-600 transition-all duration-500 rounded-full"
                  style={{ width: `${membershipProgress}%` }}
                />
              </div>
              <p className="text-xs mt-1">{membershipProgress}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Attendance</p>
              <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-600 to-green-500 transition-all duration-500 rounded-full"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
              <p className="text-xs mt-1">{attendanceRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Payments</p>
              <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-500 rounded-full"
                  style={{
                    width: `${
                      (Number(member.amount_paid) / member.membership_plan.price) *
                      100
                    }%`,
                  }}
                />
              </div>
              <p className="text-xs mt-1">
                ₹{member.amount_paid} / ₹{member.membership_plan.price}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3">
          <Card className="bg-transparent shadow-none border border-white/20 backdrop-blur-sm">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3 border-b border-white/20">
                <TabsTrigger value="personal" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                  Personal
                </TabsTrigger>
                <TabsTrigger value="membership" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                  Membership
                </TabsTrigger>
                <TabsTrigger value="fitness" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                  Fitness
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-300">Date of Birth</p>
                      <p className="text-sm font-medium">{formatDate(member.dob)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-300">Phone</p>
                      <p className="text-sm font-medium">{member.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-300">Height</p>
                      <p className="text-sm font-medium">
                        {member.height ? `${member.height} cm` : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-300">Address</p>
                      <p className="text-sm font-medium">{member.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="membership" className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-300">Membership Period</p>
                        <p className="text-sm font-medium">
                          {formatDate(member.membership_start)} - {formatDate(member.membership_end)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-300">Payment Status</p>
                        <p className="text-sm font-medium">
                          {member.is_fully_paid ? "Fully Paid" : "Pending"} (₹{member.amount_paid} / ₹{member.membership_plan.price})
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-300">Current Plan</p>
                        <p className="text-sm font-medium">
                          {member.membership_plan.name} ({member.membership_plan.duration_days} days)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-300">Plan Status</p>
                        <p className="text-sm font-medium">
                          {member.membership_plan.is_locked ? "Locked" : "Unlocked"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="fitness" className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-300">Days Present</p>
                      <p className="text-sm font-medium">{member.days_present} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-300">BMI</p>
                      <p className="text-sm font-medium">
                        {member.weight && member.height
                          ? (member.weight / ((member.height / 100) ** 2)).toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

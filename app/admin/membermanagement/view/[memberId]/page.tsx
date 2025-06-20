"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, User, Calendar, Phone, TrendingUp, DollarSign, Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react";

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
  biometric_id?: string;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "blocked":
        return <AlertCircle className="h-4 w-4" />;
      case "expired":
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "expired":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-green-500/10 text-green-400 border-green-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-medium text-white">Something went wrong</h3>
          <p className="text-gray-400 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center space-y-4">
          <User className="h-12 w-12 text-gray-500 mx-auto" />
          <h3 className="text-xl font-medium text-white">Member not found</h3>
          <p className="text-gray-400">The requested member could not be located.</p>
        </div>
      </div>
    );
  }

  const fullName = `${member.first_name} ${member.last_name}`;
  const membershipProgress = calculateProgress();
  const attendanceRate = calculateAttendanceRate();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent"></div>
        <div className="relative px-6 pt-20 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start justify-between mb-12">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                {/* Profile Image */}
                <div className="relative group">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={fullName}
                      className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl object-cover border border-white/10 shadow-2xl transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-red-500/20 to-gray-500/20 border border-white/10 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                      <User className="h-12 w-12 lg:h-16 lg:w-16 text-red-400" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2">
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-xl ${getStatusColor(member.membership_status)}`}>
                      {getStatusIcon(member.membership_status)}
                      <span className="capitalize">{member.membership_status}</span>
                    </div>
                  </div>
                </div>
                
                {/* Member Info */}
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                    {fullName}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-400">
                    <span className="text-sm font-medium">ID #{member.id}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="text-sm">{member.email}</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-xl transition-all duration-300 rounded-2xl px-6 py-3 font-medium"
                onClick={() => alert("Downloading Invoice...")}
              >
                <Download className="mr-2 h-5 w-5" /> 
                Download Invoice
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Membership Progress */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-xl">
                      <Calendar className="h-5 w-5 text-red-400" />
                    </div>
                    <span className="text-gray-300 font-medium">Membership</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{membershipProgress}%</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${membershipProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(member.membership_start)} - {formatDate(member.membership_end)}
                </p>
              </div>

              {/* Attendance */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-xl">
                      <Activity className="h-5 w-5 text-green-400" />
                    </div>
                    <span className="text-gray-300 font-medium">Attendance</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{attendanceRate}%</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{member.days_present} days present</p>
              </div>

              {/* Payment */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/20 rounded-xl">
                      <DollarSign className="h-5 w-5 text-yellow-400" />
                    </div>
                    <span className="text-gray-300 font-medium">Payment</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {Math.round((Number(member.amount_paid) / member.membership_plan.price) * 100)}%
                  </span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(Number(member.amount_paid) / member.membership_plan.price) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  ₹{member.amount_paid} of ₹{member.membership_plan.price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 p-2 rounded-none border-b border-white/10">
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger 
                value="membership" 
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300"
              >
                Membership
              </TabsTrigger>
              <TabsTrigger 
                value="fitness" 
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300"
              >
                Fitness
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <Calendar className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-medium">Date of Birth</p>
                      <p className="text-lg font-semibold text-white">{formatDate(member.dob)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Phone className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-medium">Phone Number</p>
                      <p className="text-lg font-semibold text-white">{member.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-medium">Height</p>
                      <p className="text-lg font-semibold text-white">
                        {member.height ? `${member.height} cm` : "Not recorded"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <User className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 font-medium">Address</p>
                      <p className="text-lg font-semibold text-white leading-relaxed">
                        {member.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="membership" className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-red-500/20 rounded-xl">
                        <Calendar className="h-5 w-5 text-red-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Membership Period</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Start:</span> {formatDate(member.membership_start)}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">End:</span> {formatDate(member.membership_end)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-yellow-500/20 rounded-xl">
                        <DollarSign className="h-5 w-5 text-yellow-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Payment Status</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Amount Paid</span>
                        <span className="text-white font-semibold">₹{member.amount_paid}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="text-white font-semibold">₹{member.membership_plan.price}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-gray-400">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.is_fully_paid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {member.is_fully_paid ? "Fully Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <Activity className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Current Plan</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-white">{member.membership_plan.name}</p>
                      <p className="text-gray-400">{member.membership_plan.duration_days} days duration</p>
                      <div className="flex items-center space-x-2 pt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.membership_plan.is_locked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {member.membership_plan.is_locked ? "Locked" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="fitness" className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-xl">
                      <Activity className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Attendance</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">{member.days_present}</p>
                  <p className="text-gray-400">days present</p>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Weight</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">
                    {member.weight ? `${member.weight}` : "—"}
                  </p>
                  <p className="text-gray-400">kg</p>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Activity className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">BMI</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">
                    {member.weight && member.height
                      ? (member.weight / ((member.height / 100) ** 2)).toFixed(1)
                      : "—"}
                  </p>
                  <p className="text-gray-400">body mass index</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
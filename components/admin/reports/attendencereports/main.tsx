"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Users, CheckCircle, Calendar, Briefcase, BarChart3 } from "lucide-react";

// Import attendance charts
import { AttendanceTrendsChart } from "./AttendanceTrendsChart";
import { TrainerAttendanceChart } from "./TrainerAttendanceChart";
import { StaffAttendanceChart } from "./StaffAttendanceChart";
import { MembersAttendanceChart } from "./MembersAttendancePieChart";


export default function AttendanceReport() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header with Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
          📄 Attendance Report
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-background rounded-md p-2 shadow-sm w-full sm:w-auto">
            <DatePicker selectedDate={startDate} onDateChange={setStartDate} />
            <span className="mx-2 text-muted-foreground">to</span>
            <DatePicker selectedDate={endDate} onDateChange={setEndDate} />
          </div>
          <Button className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Quick Stats Section */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📌 Quick Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Check-ins</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              3,200
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Trainer Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-muted-foreground" />
              92%
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Staff Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-muted-foreground" />
              88%
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts Section */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📊 Attendance Insights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📈 Overall Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTrendsChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>📊 Trainer Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainerAttendanceChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>📊 Staff Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <StaffAttendanceChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>🥧 Members Attendance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <MembersAttendanceChart />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Attendance Records Table */}
    </div>
  );
}

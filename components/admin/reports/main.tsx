"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Users, DollarSign, FileText } from "lucide-react";
import { MembershipChart } from "./MembershipChart";
import { RevenueChart } from "./RevenueChart";
import { ExpenseChart } from "./ExpensesChart";

export default function ReportsDashboard() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Section with Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
          Reports Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-background rounded-md p-2 shadow-sm w-full sm:w-auto">
            <DatePicker selectedDate={startDate} onDateChange={setStartDate} />
            <span className="mx-2 text-muted-foreground">to</span>
            <DatePicker selectedDate={endDate} onDateChange={setEndDate} />
          </div>
          <Button className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Reports Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {["Membership", "Trainer", "Sales", "Attendance", "Expense"].map((report) => (
          <Button key={report} variant="outline" className="w-full">
            {report} Report
          </Button>
        ))}
      </div>

      {/* Quick Stats */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📈 Quick Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Members</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              1,200
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-muted-foreground" />
              ₹5,00,000
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-muted-foreground" />
              ₹1,50,000
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts & Insights */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📊 Charts & Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <MembershipChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📄 Recent Reports Generated
        </h2>
        <div className="space-y-4">
          {[
            { name: "Membership Report", date: "12 Mar 2025" },
            { name: "Sales Report", date: "10 Mar 2025" },
            { name: "Trainer Report", date: "08 Mar 2025" },
          ].map((report, index) => (
            <Card key={index} className="p-4">
              <CardContent className="flex justify-between items-center">
                <span>{report.name}</span>
                <span className="text-sm text-muted-foreground">{report.date}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

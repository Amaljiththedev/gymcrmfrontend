"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchReportsOverview } from "@/src/features/reports/reportsOverviewSlice";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Users, FileText, IndianRupee } from "lucide-react";

import { MembershipChart } from "./MembershipChart";
import { RevenueChart } from "./RevenueChart";
import { ExpenseChart } from "./ExpensesChart";

export default function ReportsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: overview, loading } = useSelector(
    (state: RootState) => state.reportsOverview
  );

  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        fetchReportsOverview({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        })
      );
    }
  }, [startDate, endDate, dispatch]);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {["Membership", "Trainer", "Sales", "Attendance", "Expense"].map((report) => (
          <Button key={report} variant="outline" className="w-full">
            {report} Report
          </Button>
        ))}
      </div>

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
              {loading ? "..." : overview?.active_members ?? 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-muted-foreground" />
              {loading ? "..." : `₹${(overview?.total_revenue ?? 0).toLocaleString("en-IN")}`}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-muted-foreground" />
              {loading ? "..." : `₹${(overview?.total_expenses ?? 0).toLocaleString("en-IN")}`}
            </CardContent>
          </Card>
        </div>
      </section>

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
              <MembershipChart  startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses Overview</CardTitle>
            </CardHeader>
            <CardContent>
            <ExpenseChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
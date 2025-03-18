"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Wallet, FileText, TrendingUp } from "lucide-react";
import { SalesOverTimeChart } from "./SalesOverTimeChart";
import { SalesByPlanChart } from "./SalesByPlanChart";
import { PendingRenewalsChart } from "./PendingRenewalsChart";  // New import
import { SalesTransactionsTable } from "./SalesTransactionsTable";

export default function SalesReport() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Section with Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
          📄 Sales Report
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

      {/* Quick Stats */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📈 Quick Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-muted-foreground" />
              ₹1,50,000
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-muted-foreground" />
              500
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2 text-yellow-500">
              <Wallet className="w-6 h-6" />
              ₹20,000
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2 text-green-500">
              🔥 VIP
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts & Insights */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📊 Charts & Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesOverTimeChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sales by Membership Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesByPlanChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Renewals Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <PendingRenewalsChart />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Sales Transactions Table */}
      <SalesTransactionsTable />
    </div>
  );
}

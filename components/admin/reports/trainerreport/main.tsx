"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { User, DollarSign, BarChart2, Activity } from "lucide-react";
import { TrainerPerformanceChart } from "./TrainerPerformanceChart";
import { TrainerSessionsChartLine } from "./TrainerSessionsChart";
import { TrainerTable } from "./TrainerTable";

export default function TrainerReports() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Section with Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
          📄 Trainer Report
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-background rounded-md p-2 shadow-sm w-full sm:w-auto">
            <DatePicker selectedDate={startDate} onDateChange={setStartDate} />
            <span className="mx-2 text-muted-foreground">to</span>
            <DatePicker selectedDate={endDate} onDateChange={setEndDate} />
          </div>
          <Button className="w-full sm:w-auto">
            <DollarSign className="h-4 w-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Quick Stats */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📈 Quick Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Trainers</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-muted-foreground" />
              12
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Rating</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-muted-foreground" />
              4.5
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Sessions</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-muted-foreground" />
              1,200
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts & Insights */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📊 Charts & Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trainer Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainerPerformanceChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Trainer Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainerSessionsChartLine />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trainer Details Table */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📄 Trainer Details
        </h2>
        <TrainerTable />
      </section>
    </div>
  );
}

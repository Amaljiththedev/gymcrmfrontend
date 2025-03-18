"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample Staff Attendance Data
const chartData = [
  { month: "Jan", attendance: 24 },
  { month: "Feb", attendance: 28 },
  { month: "Mar", attendance: 22 },
  { month: "Apr", attendance: 26 },
  { month: "May", attendance: 30 },
  { month: "Jun", attendance: 25 },
];

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StaffAttendanceChart() {
  return (
    <Card className="bg-transparent border border-white/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-white">📅 Staff Attendance</CardTitle>
        <CardDescription className="text-muted-foreground">Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.2} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "white", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "white", fontSize: 12 }} />
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="attendance" radius={5} fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          Attendance stable this month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Monthly attendance data for staff.
        </div>
      </CardFooter>
    </Card>
  );
}

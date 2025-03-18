"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const attendanceData = [
  { month: "January", present: 186, absent: 30 },
  { month: "February", present: 305, absent: 40 },
  { month: "March", present: 237, absent: 25 },
  { month: "April", present: 210, absent: 35 },
  { month: "May", present: 290, absent: 20 },
  { month: "June", present: 275, absent: 15 },
];

const chartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AttendanceTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Attendance Trends</CardTitle>
        <CardDescription>Comparison of Present vs Absent Members</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid vertical={false} strokeOpacity={0.2} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="present" stackId="a" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" stackId="a" fill="hsl(var(--chart-3))" radius={[0, 0, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Attendance consistency improving <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Data from January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}

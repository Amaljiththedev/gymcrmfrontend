"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

// Sample Attendance Data (Trainers)
const chartData = [
  { trainer: "John Doe", attendance: 25, fill: "hsl(var(--chart-1))" },
  { trainer: "Jane Smith", attendance: 20, fill: "hsl(var(--chart-2))" },
  { trainer: "Mark Wilson", attendance: 28, fill: "hsl(var(--chart-3))" },
  { trainer: "Emily Davis", attendance: 22, fill: "hsl(var(--chart-4))" },
];

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TrainerAttendanceChart() {
  return (
    <Card className="bg-transparent border border-white/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-white">🏋️‍♂️ Trainer Attendance</CardTitle>
        <CardDescription className="text-muted-foreground">Attendance for Last Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
            >
              <XAxis type="number" tick={{ fill: "white", fontSize: 12 }} />
              <YAxis
                dataKey="trainer"
                type="category"
                tick={{ fill: "white", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="attendance" radius={[5, 5, 0, 0]} fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          Attendance stable this month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Monthly attendance data for trainers.
        </div>
      </CardFooter>
    </Card>
  );
}

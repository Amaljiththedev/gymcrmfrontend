"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { trainer: "John Doe", sessions: 120 },
  { trainer: "Jane Smith", sessions: 90 },
  { trainer: "Mark Wilson", sessions: 150 },
  { trainer: "Emily Davis", sessions: 140 },
];

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TrainerPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainer Performance</CardTitle>
        <CardDescription>Sessions per Trainer (Jan - Jun 2025)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" dataKey="sessions" hide={false} />
              <YAxis
                dataKey="trainer"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="sessions" fill="hsl(var(--chart-1))" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sessions for trainers
        </div>
      </CardFooter>
    </Card>
  );
}

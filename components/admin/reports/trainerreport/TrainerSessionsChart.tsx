"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

// Sample trainer sessions data over 6 months
const chartData = [
  { month: "January", sessions: 120 },
  { month: "February", sessions: 100 },
  { month: "March", sessions: 130 },
  { month: "April", sessions: 110 },
  { month: "May", sessions: 140 },
  { month: "June", sessions: 125 },
];

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TrainerSessionsChartLine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainer Sessions Trend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.2} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis hide />
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Line
                dataKey="sessions"
                type="natural"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing trainer sessions for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

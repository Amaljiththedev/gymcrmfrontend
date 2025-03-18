"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
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

// Updated dummy data for total enrollment trends (sum of desktop and mobile)
const chartData = [
  { month: "January", total: 240 },   // 150 + 90
  { month: "February", total: 280 },  // 180 + 100
  { month: "March", total: 310 },     // 200 + 110
  { month: "April", total: 350 },     // 220 + 130
  { month: "May", total: 330 },       // 210 + 120
  { month: "June", total: 390 },      // 250 + 140
];

// Chart configuration for theming and labeling
const chartConfig = {
  total: {
    label: "Total Enrollments",
    color: "hsl(var(--chart-1))", // This sets CSS variable --color-total
  },
} satisfies ChartConfig;

export function EnrollmentTrendsLineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Enrollment Trends Line Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="total"
                type="monotone"
                stroke="var(--color-total)"
                strokeWidth={4} // Increased for a stronger line
                dot={{ fill: "var(--color-total)", r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

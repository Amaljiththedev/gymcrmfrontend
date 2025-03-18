"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

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

const chartData = [
  { month: "January", pendingRenewals: 45 },
  { month: "February", pendingRenewals: 60 },
  { month: "March", pendingRenewals: 50 },
  { month: "April", pendingRenewals: 70 },
  { month: "May", pendingRenewals: 55 },
  { month: "June", pendingRenewals: 65 },
];

const chartConfig = {
  pendingRenewals: {
    label: "Pending Renewals",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PendingRenewalsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Renewals</CardTitle>
        <CardDescription>Comparison from January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
              <XAxis type="number" dataKey="pendingRenewals" hide />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="pendingRenewals" fill="hsl(var(--chart-1))" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Pending renewals increased by 4% this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          A month-wise breakdown of pending renewals.
        </div>
      </CardFooter>
    </Card>
  );
}

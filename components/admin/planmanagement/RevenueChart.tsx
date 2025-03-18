"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer, Cell } from "recharts";
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

// Dummy revenue data for each plan
const chartData = [
  { plan: "Basic", revenue: 2998.5, fill: "hsl(var(--chart-1))" },
  { plan: "Pro", revenue: 9998.0, fill: "hsl(var(--chart-2))" },
  { plan: "Elite", revenue: 10399.0, fill: "hsl(var(--chart-3))" },
  { plan: "Annual", revenue: 12299.5, fill: "hsl(var(--chart-4))" },
];

// Chart configuration object for potential dynamic theming
const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  Basic: {
    label: "Basic",
    color: "hsl(var(--chart-1))",
  },
  Pro: {
    label: "Pro",
    color: "hsl(var(--chart-2))",
  },
  Elite: {
    label: "Elite",
    color: "hsl(var(--chart-3))",
  },
  Annual: {
    label: "Annual",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function RevenueRadialChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>🎯 Revenue Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="plan" />}
              />
              <RadialBar dataKey="revenue" background />
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

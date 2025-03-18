"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

const genderData = [
  { category: "Teen Boys", count: 150 },
  { category: "Teen Girls", count: 120 },
  { category: "Men 50+", count: 100 },
  { category: "Women 50+", count: 140 },
  { category: "Young Men (20-49)", count: 300 },
  { category: "Young Women (20-49)", count: 280 },
];

const chartConfig = {
  count: {
    label: "Members",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AgeGenderBreakdownChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Gender & Age Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            layout="vertical"
            data={genderData}
            margin={{ left: 20, right: 20 }}
          >
            <CartesianGrid horizontal={false} strokeOpacity={0.2} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Gender-based membership trends <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}


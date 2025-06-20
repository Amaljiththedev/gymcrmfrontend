"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchRevenueByPlan } from "@/src/features/reports/revenueChartSlice";

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  startDate: Date;
  endDate: Date;
};

export function RevenueRadialChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.revenueChart);

  useEffect(() => {
    if (startDate && endDate) {
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];
      dispatch(fetchRevenueByPlan({ start, end }));
    }
  }, [startDate, endDate, dispatch]);

  const themedData = data.map((item, index) => ({
    ...item,
    fill: `hsl(var(--chart-${(index % 12) + 1}))`,
  }));

  // Optional: Construct a config if you plan to label lines using the chart system
  const chartConfig = themedData.reduce((acc, item) => {
    acc[item.plan] = {
      label: item.plan,
      color: item.fill,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  chartConfig["revenue"] = { label: "Revenue", color: "hsl(var(--chart-1))" };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>🎯 Revenue Chart</CardTitle>
        <CardDescription>
          {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart data={themedData} innerRadius={30} outerRadius={110}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel={false} nameKey="plan" />}
              />
              <RadialBar dataKey="revenue" background />
              {themedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {loading ? "Loading..." : "Trending up by 5.2% this month"}
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue grouped by plan
        </div>

        {/* 📌 Dynamic Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-2">
          {themedData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              {entry.plan}
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

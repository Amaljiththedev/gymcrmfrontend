"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchAgeGenderBreakdown } from "@/src/features/memberdemographics/ageGenderBreakdownSlice";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

const chartConfig = {
  count: {
    label: "Members",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AgeGenderBreakdownChart() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: genderData, loading } = useSelector(
    (state: RootState) => state.ageGenderBreakdown
  );

  useEffect(() => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 30);

    dispatch(
      fetchAgeGenderBreakdown({
        startDate: past.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      })
    );
  }, [dispatch]);

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

        {loading && (
          <div className="text-center text-muted-foreground mt-4">Loading Chart...</div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Gender-based membership trends <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

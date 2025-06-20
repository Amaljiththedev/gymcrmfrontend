"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchEnrollmentChart } from "@/src/features/reports/enrollmentChartSlice";

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

type Props = {
  startDate: Date;
  endDate: Date;
};

export function EnrollmentTrendsLineChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.enrollmentChart);

  useEffect(() => {
    if (startDate && endDate) {
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];
      dispatch(fetchEnrollmentChart({ start, end }));
    }
  }, [startDate, endDate, dispatch]);

  const chartConfig = {
    total: {
      label: "Total Enrollments",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Rename `enrollments` to `total` to match chartConfig
  const chartData = data.map((d) => ({
    month: d.month,
    total: d.enrollments,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Enrollment Trends Line Chart</CardTitle>
        <CardDescription>
          {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
        </CardDescription>
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
                strokeWidth={4}
                dot={{ fill: "var(--color-total)", r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {loading ? "Loading..." : "Trending up by 5.2% this month"}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total enrollments for the selected range
        </div>
      </CardFooter>
    </Card>
  );
}

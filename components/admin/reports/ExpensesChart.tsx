"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchExpenseBreakdown } from "@/src/features/reports/expenseBreakdownSlice";

import { TrendingUp } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type Props = {
  startDate: Date;
  endDate: Date;
};

export function ExpenseChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.expenseBreakdown);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        fetchExpenseBreakdown({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        })
      );
    }
  }, [startDate, endDate, dispatch]);

  // Dynamic chart config from categories
  const chartConfig = data.reduce((acc: any, item, index) => {
    const key = item.category;
    acc[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {});

  // Convert to Recharts format (1-row stacked bar)
  const chartData = [
    data.reduce(
      (acc, item) => ({ ...acc, [item.category]: item.total }),
      { name: "Expenses" }
    ),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses Overview</CardTitle>
        <CardDescription>
          {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={`var(--color-${key})`}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Category-wise distribution <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing expenses by category for selected range
        </div>
      </CardFooter>
    </Card>
  );
}

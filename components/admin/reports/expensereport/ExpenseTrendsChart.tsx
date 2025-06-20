"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchExpenseTrends } from "@/src/features/expensereports/expenseTrendsSlice";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

type Props = {
  startDate: Date;
  endDate: Date;
};

export function ExpenseTrendsChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: expenseData, loading } = useSelector(
    (state: RootState) => state.expenseTrends
  );

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchExpenseTrends({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      }));
    }
  }, [dispatch, startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Expense Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          expenses: { label: "Expenses", color: "hsl(var(--chart-1))" }
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={expenseData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.2} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="expenses"
                type="natural"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Expenses increased by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">Data from last 6 months</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

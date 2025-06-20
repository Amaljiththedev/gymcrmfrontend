"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchSalesByPlan } from "@/src/features/salesreport/salesByPlanSlice";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type Props = {
  startDate: Date;
  endDate: Date;
};

export function SalesByPlanChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: chartData, loading } = useSelector((state: RootState) => state.salesByPlan);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        fetchSalesByPlan({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        })
      );
    }
  }, [dispatch, startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Membership Plan</CardTitle>
        <CardDescription>Showing sales between selected dates</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="plan" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={8}>
                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 3.8% this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Sales performance by plan
        </div>
      </CardFooter>
    </Card>
  );
}

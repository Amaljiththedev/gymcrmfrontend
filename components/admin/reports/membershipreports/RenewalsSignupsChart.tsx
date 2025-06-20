"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchRenewalsSignups } from "@/src/features/membershipreports/renewalsSignupsSlice";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  startDate: Date;
  endDate: Date;
};

const chartConfig = {
  renewals: {
    label: "Renewals",
    color: "hsl(var(--chart-1))",
  },
  signups: {
    label: "New Signups",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function RenewalsSignupsChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.renewalsSignups);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        fetchRenewalsSignups({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        })
      );
    }
  }, [dispatch, startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Renewals vs New Signups</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="renewals" stackId="a" fill="var(--color-renewals)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="signups" stackId="a" fill="var(--color-signups)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing renewals vs new signups
        </div>
      </CardFooter>
    </Card>
  );
}

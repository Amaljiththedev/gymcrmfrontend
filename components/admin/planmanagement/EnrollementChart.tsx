"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchEnrollmentChart } from "@/src/features/reports/enrollmentChartSlice";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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
import { TrendingUp } from "lucide-react";

type Props = {
  startDate: Date;
  endDate: Date;
};

export function EnrollmentChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.enrollmentChart);

  useEffect(() => {
    if (startDate && endDate) {
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];
      dispatch(fetchEnrollmentChart({ start, end }));
    }
  }, [startDate, endDate, dispatch]);

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-white text-lg">📊 Enrollment Trends</CardTitle>
        <CardDescription className="text-muted-foreground">
          {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--foreground)" }} />
            <YAxis tick={{ fill: "var(--foreground)" }} />
            <Tooltip cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="enrollments" fill="hsl(var(--chart-1))" radius={8} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="flex items-center gap-2 text-sm text-white">
        <TrendingUp className="h-4 w-4 text-green-500" />
        {loading ? "Fetching trend..." : "Trending up by 5.2% this month"}
      </CardFooter>
    </Card>
  );
}

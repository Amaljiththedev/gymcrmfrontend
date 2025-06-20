"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchMembershipGrowth } from "@/src/features/reports/membershipGrowthSlice";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  startDate: Date;
  endDate: Date;
};

export function MembershipChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: chartData, loading, error } = useSelector(
    (state: RootState) => state.membershipGrowth
  );

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        fetchMembershipGrowth({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        })
      );
    }
  }, [dispatch, startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Membership Growth Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-500">Error: {error}</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.2} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="members"
                stroke="#3b82f6"
                fill="red"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

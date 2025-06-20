"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchMembershipPlanStats } from "@/src/features/reports/MembershipPlanReportSlice"; // Ensure this matches actual file name
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  startDate: Date;
  endDate: Date;
};

export default function KPISection({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.membershipPlanStats);

  useEffect(() => {
    if (startDate && endDate) {
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];
      dispatch(fetchMembershipPlanStats({ start, end })); // ✅ updated key names
    }
  }, [startDate, endDate, dispatch]);

  
  return (
    <>
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Total Enrollments</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {loading ? "Loading..." : data?.total_enrollments ?? "—"}
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {loading ? "Loading..." : `₹${data?.total_revenue?.toLocaleString("en-IN") ?? "—"}`}
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader>
          <CardTitle>Most Popular Plan</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {loading ? "Loading..." : data?.most_popular_plan ?? "—"}
        </CardContent>
      </Card>
    </>
  );
}

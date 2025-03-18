"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { month: "Jan", members: 800 },
  { month: "Feb", members: 950 },
  { month: "Mar", members: 1020 },
  { month: "Apr", members: 1150 },
  { month: "May", members: 1200 },
  { month: "Jun", members: 1300 },
];

export function MembershipChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Membership Growth Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeOpacity={0.2} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="members" stroke="blue" fill="red" fillOpacity={0.4} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

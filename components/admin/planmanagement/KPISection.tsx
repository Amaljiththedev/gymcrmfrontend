import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KPISection() {
  return (
    <>
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Total Enrollments</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">700</CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">$52,392</CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader>
          <CardTitle>Most Popular Plan</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">Annual</CardContent>
      </Card>
    </>
  );
}

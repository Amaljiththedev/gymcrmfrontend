"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample dummy data — replace this with your actual data
const renewals = [
  {
    name: "John Doe",
    plan: "Gold Plan",
    expiry: "2025-04-15",
    status: "Pending",
  },
  {
    name: "Jane Smith",
    plan: "Silver Plan",
    expiry: "2025-04-17",
    status: "Scheduled",
  },
  {
    name: "Mike Johnson",
    plan: "Platinum Plan",
    expiry: "2025-04-18",
    status: "Reminder Sent",
  },
];

const statusColor: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
  Pending: "destructive",
  Scheduled: "default",
  "Reminder Sent": "secondary",
};

export default function UpcomingRenewalsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renewals.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.plan}</TableCell>
                <TableCell>{r.expiry}</TableCell>
                <TableCell>
                  <Badge variant={statusColor[r.status as keyof typeof statusColor]}>
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

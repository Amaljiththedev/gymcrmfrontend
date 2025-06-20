"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchDashboardStats } from "@/src/features/dashboard/dashboardSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  startDate: Date;
  endDate: Date;
};

// Optional: format big numbers
const formatCurrency = (amount: number) => {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function KPISection({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState & { dashboard: any }) => state.dashboard);

  useEffect(() => {
    if (startDate && endDate) {
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];
      dispatch(fetchDashboardStats({ startDate: start, endDate: end }));
    }
  }, [startDate, endDate]);

  const loadingCards = new Array(4).fill(null).map((_, idx) => (
    <Card key={idx} className="animate-pulse">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium bg-muted w-3/4 h-4 rounded" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-muted h-6 w-1/2 rounded" />
        <p className="text-xs bg-muted h-3 w-2/3 rounded mt-2" />
      </CardContent>
    </Card>
  ));

  if (loading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{loadingCards}</div>;
  }

  if (error) {
    return <p className="text-sm text-red-500">❌ {error}</p>;
  }

  if (!data) {
    return null;
  }

  const cards = [
    { title: "Total Revenue", value: formatCurrency(data.total_revenue), desc: "In selected range" },
    { title: "Total Expenses", value: formatCurrency(data.total_expenses), desc: "Spent this period" },
    { title: "Gross Profit (Est.)", value: formatCurrency(data.gross_profit), desc: "25% margin estimate" },
    { title: "Net Profit", value: formatCurrency(data.net_profit), desc: "Revenue - Expenses" },
    { title: "New Members", value: data.new_members, desc: "Joined in range" },
    { title: "Active Members", value: data.active_members, desc: "Currently active" },
    { title: "Expiring Soon", value: data.expiring_soon, desc: "Next 7 days" },
    { title: "Renewals", value: data.renewals, desc: "Renewed in range" },
    { title: "New Signups", value: data.new_signups, desc: "Today" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, DollarSign, Calendar, CreditCard, User } from "lucide-react";

const salesData = [
  { id: 1, member: "John Doe", plan: "VIP", amount: "₹10,000", payment: "UPI", status: "Paid", date: "15 Mar 2025" },
  { id: 2, member: "Jane Smith", plan: "Basic", amount: "₹2,000", payment: "Card", status: "Pending", date: "14 Mar 2025" },
  { id: 3, member: "Alex Johnson", plan: "Standard", amount: "₹5,000", payment: "Cash", status: "Paid", date: "13 Mar 2025" },
  { id: 4, member: "Emily Brown", plan: "Premium", amount: "₹7,500", payment: "UPI", status: "Refunded", date: "12 Mar 2025" },
];

export function SalesTransactionsTable() {
  return (
    <Card className="bg-gradient-to-br from-black to-gray-900 border border-red-600 shadow-lg rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-red-500" />
          Recent Sales Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-red-900 text-white text-lg">
                {["Member", "Plan", "Amount", "Payment", "Status", "Date"].map((header) => (
                  <th key={header} className="px-6 py-3 font-semibold text-left border-b border-red-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesData.map((row, index) => (
                <tr 
                  key={row.id} 
                  className={`transition-all ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"} hover:bg-red-800/50`}
                >
                  <td className="px-6 py-4 text-white text-lg">{row.member}</td>
                  <td className="px-6 py-4">
                    <Badge 
                      className={`text-white px-3 py-1 text-lg font-medium ${
                        row.plan === "VIP" ? "bg-purple-700" : 
                        row.plan === "Premium" ? "bg-blue-700" : 
                        row.plan === "Standard" ? "bg-green-700" : "bg-gray-700"
                      }`}
                    >
                      {row.plan}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-white text-lg font-semibold">{row.amount}</td>
                  <td className="px-6 py-4 text-white text-lg">{row.payment}</td>
                  <td className="px-6 py-4">
                    <Badge 
                      className={`text-white px-3 py-1 text-lg font-medium ${
                        row.status === "Paid" ? "bg-emerald-600" : 
                        row.status === "Pending" ? "bg-amber-600" : "bg-red-600"
                      }`}
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-white text-lg">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

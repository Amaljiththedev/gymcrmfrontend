"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar } from "lucide-react";

const expenseData = [
  { id: 1, category: "Rent", amount: "₹30,000", status: "Paid", date: "15 Mar 2025" },
  { id: 2, category: "Utilities", amount: "₹5,000", status: "Pending", date: "12 Mar 2025" },
  { id: 3, category: "Salaries", amount: "₹50,000", status: "Paid", date: "10 Mar 2025" },
  { id: 4, category: "Maintenance", amount: "₹8,000", status: "Paid", date: "05 Mar 2025" },
];

export function ExpenseTransactionsTable() {
  return (
    <Card className="bg-transparent border border-white/20 shadow-xl backdrop-blur-sm">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white text-2xl font-bold flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-white" strokeWidth={1.5} />
          Expense Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-white/10">
              <TableHead className="text-white text-lg font-semibold">Category</TableHead>
              <TableHead className="text-white text-lg font-semibold">Amount</TableHead>
              <TableHead className="text-white text-lg font-semibold">Status</TableHead>
              <TableHead className="text-white text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-white" strokeWidth={1.5} />
                  Date
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenseData.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-white/5 transition-all duration-200 border-b border-white/10"
              >
                <TableCell className="text-white text-lg font-medium">{row.category}</TableCell>
                <TableCell className="text-white text-lg font-semibold">{row.amount}</TableCell>
                <TableCell>
                  <Badge
                    className={`px-3 py-1 text-base font-medium ${
                      row.status === "Paid" 
                        ? "bg-green-500/80 hover:bg-green-500 text-white" 
                        : "bg-yellow-500/80 hover:bg-yellow-500 text-white"
                    }`}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-white text-lg">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
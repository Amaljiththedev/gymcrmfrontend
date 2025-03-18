"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const expenseData = [
  { category: "Salaries", amount: 50000, fill: "hsl(var(--chart-1))" },
  { category: "Rent", amount: 30000, fill: "hsl(var(--chart-2))" },
  { category: "Utilities", amount: 15000, fill: "hsl(var(--chart-3))" },
  { category: "Miscellaneous", amount: 25000, fill: "hsl(var(--chart-4))" },
];

// ✅ FIX: Convert expenseData into a valid ChartConfig object
const chartConfig: ChartConfig = expenseData.reduce((acc, item, index) => {
  acc[item.category] = {
    label: item.category,
    color: item.fill,
  };
  return acc;
}, {} as ChartConfig);

export function ExpenseCategoryChart() {
  const totalExpenses = expenseData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Card className="flex flex-col w-full max-w-3xl mx-auto shadow-lg p-6">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-3xl font-bold">📊 Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={expenseData}
                dataKey="amount"
                nameKey="category"
                innerRadius={90} // Bigger Donut
                outerRadius={140}
                strokeWidth={6}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-white text-4xl font-extrabold">
                            ₹{totalExpenses.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 30} className="fill-white text-lg">
                            Total Expenses
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-3 text-lg">
        <div className="flex items-center gap-2 font-semibold text-green-400">
          Spending trend stable <TrendingUp className="h-6 w-6" />
        </div>
      </CardFooter>
    </Card>
  );
}

"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", rent: 10000, salaries: 12000, utilities: 8000 },
  { month: "February", rent: 10000, salaries: 14000, utilities: 9000 },
  { month: "March", rent: 10000, salaries: 13000, utilities: 8500 },
  { month: "April", rent: 10000, salaries: 15000, utilities: 9200 },
  { month: "May", rent: 10000, salaries: 14500, utilities: 9100 },
  { month: "June", rent: 10000, salaries: 16000, utilities: 9500 },
]

const chartConfig = {
  rent: {
    label: "Rent",
    color: "hsl(var(--chart-1))",
  },
  salaries: {
    label: "Salaries",
    color: "hsl(var(--chart-2))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="rent"
              stackId="a"
              fill="var(--color-rent)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="salaries"
              stackId="a"
              fill="var(--color-salaries)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="utilities"
              stackId="a"
              fill="var(--color-utilities)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Expenses increased by 8% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing category-wise expenses for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

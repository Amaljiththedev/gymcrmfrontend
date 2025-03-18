"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Dot, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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

// Sample Attendance Data (Monthly)
const chartData = [
  { month: "Jan", attendees: 320, fill: "hsl(var(--chart-1))" },
  { month: "Feb", attendees: 280, fill: "hsl(var(--chart-2))" },
  { month: "Mar", attendees: 350, fill: "hsl(var(--chart-3))" },
  { month: "Apr", attendees: 300, fill: "hsl(var(--chart-4))" },
  { month: "May", attendees: 370, fill: "hsl(var(--chart-5))" },
  { month: "Jun", attendees: 340, fill: "hsl(var(--chart-6))" },
];

const chartConfig = {
  attendees: {
    label: "Attendees",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AttendanceTrendsChart() {
  return (
    <Card className="bg-transparent border border-white/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-white">📈 Attendance Trends</CardTitle>
        <CardDescription className="text-muted-foreground">January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 20, left: -10 }}>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" nameKey="attendees" />}
              />
              <Line
                dataKey="attendees"
                type="monotone"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={({ payload, ...props }) => (
                  <Dot
                    key={payload.month}
                    r={6}
                    cx={props.cx}
                    cy={props.cy}
                    fill={payload.fill}
                    stroke={payload.fill}
                    className="shadow-lg"
                  />
                )}
                activeDot={{ r: 8, className: "opacity-80" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Attendance statistics over the last 6 months.
        </div>
      </CardFooter>
    </Card>
  );
}

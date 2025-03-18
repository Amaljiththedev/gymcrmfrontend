"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample Attendance Data (Active vs. Absent)
const attendanceData = [
  { month: "January", active: 320, absent: 80, fillActive: "hsl(var(--chart-1))", fillAbsent: "hsl(var(--chart-2))" },
  { month: "February", active: 290, absent: 110, fillActive: "hsl(var(--chart-1))", fillAbsent: "hsl(var(--chart-2))" },
  { month: "March", active: 310, absent: 90, fillActive: "hsl(var(--chart-1))", fillAbsent: "hsl(var(--chart-2))" },
  { month: "April", active: 280, absent: 120, fillActive: "hsl(var(--chart-1))", fillAbsent: "hsl(var(--chart-2))" },
  { month: "May", active: 330, absent: 70, fillActive: "hsl(var(--chart-1))", fillAbsent: "hsl(var(--chart-2))" },
];

const chartConfig = {
  active: { label: "Active Members", color: "hsl(var(--chart-1))" },
  absent: { label: "Absent Members", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export function MembersAttendanceChart() {
  const id = "pie-members-attendance";
  const [activeMonth, setActiveMonth] = React.useState(attendanceData[0].month);

  const activeIndex = React.useMemo(
    () => attendanceData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  );

  const months = React.useMemo(() => attendanceData.map((item) => item.month), []);

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>📊 Members Attendance</CardTitle>
          <CardDescription>Active vs. Absent Members (Jan - June 2024)</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((key) => (
              <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: chartConfig[key as keyof typeof chartConfig]?.color,
                    }}
                  />
                  {key}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={[
                { name: "Active", value: attendanceData[activeIndex].active, fill: attendanceData[activeIndex].fillActive },
                { name: "Absent", value: attendanceData[activeIndex].absent, fill: attendanceData[activeIndex].fillAbsent },
              ]}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {attendanceData[activeIndex].active.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Active Members
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

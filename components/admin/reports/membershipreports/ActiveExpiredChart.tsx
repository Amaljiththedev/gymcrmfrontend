"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

const chartConfig = {
  active: {
    label: "Active Members",
    color: "hsl(var(--chart-1))",
  },
  expired: {
    label: "Expired Members",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ActiveExpiredChart() {
  const { data: stats, loading } = useSelector(
    (state: RootState) => state.membershipStatus
  );

  const chartData = [
    {
      name: "Active Members",
      value: stats?.active || 0,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Expired Members",
      value: stats?.expired || 0,
      fill: "hsl(var(--chart-2))",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>🥧 Active vs Expired Members</CardTitle>
        <CardDescription>Last 30 Days</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading chart...</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] px-0"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="name" hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                labelLine={false}
                label={({ payload, ...props }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="hsla(var(--foreground))"
                    >
                      {payload.value}
                    </text>
                  );
                }}
                nameKey="name"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Membership data based on current status
        </div>
      </CardFooter>
    </Card>
  );
}

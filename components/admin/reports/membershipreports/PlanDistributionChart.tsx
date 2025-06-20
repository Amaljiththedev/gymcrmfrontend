"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchPlanDistribution } from "@/src/features/membershipreports/planDistributionSlice";

import { TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";

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

// Chart config for style
const chartConfig = {
  members: {
    label: "Members",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PlanDistributionChart() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.planDistribution);

  useEffect(() => {
    dispatch(fetchPlanDistribution());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>📊 Plan Distribution</CardTitle>
        <CardDescription>
          Showing current plan usage among active members
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        {loading ? (
          <div className="text-sm text-muted-foreground text-center">
            Loading chart...
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadarChart data={data}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="plan" />
              <PolarGrid />
              <Radar
                dataKey="members"
                fill="var(--color-members)"
                fillOpacity={0.6}
                dot={{ r: 3 }}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Based on currently active members
        </div>
      </CardFooter>
    </Card>
  );
}

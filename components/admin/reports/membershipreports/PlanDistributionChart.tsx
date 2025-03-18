"use client";


import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { plan: "Basic", members: 300 },
  { plan: "Standard", members: 450 },
  { plan: "Premium", members: 250 },
  { plan: "VIP", members: 120 },
]

const chartConfig = {
  desktop: {
    label: "members",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function PlanDistributionChart() {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>📊 Plan Distribution</CardTitle>
        <CardDescription>Membership distribution across different plans</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="plan" />
            <PolarGrid />
            <Radar
              dataKey="members-pui8ytrfedswqa   b "
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}

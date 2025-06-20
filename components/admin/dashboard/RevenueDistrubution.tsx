"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { AppDispatch, RootState } from "@/src/store/store"
import { fetchMonthlySummary } from "@/src/features/dashboard/dashboardSlice"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Props = {
  startDate: string
  endDate: string
}

export function RevenueOverTimeChart({ startDate, endDate }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const { monthlySummary, monthlyLoading, monthlyError } = useSelector(
    (state: RootState) => state.dashboard
  )

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchMonthlySummary({ startDate, endDate }))
    }
  }, [dispatch, startDate, endDate])

  const chartData = monthlySummary.map((item) => ({
    month: item.month,
    revenue: item.revenue,
  }))

  const formattedStart = new Date(startDate).toLocaleDateString()
  const formattedEnd = new Date(endDate).toLocaleDateString()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>
          {formattedStart} – {formattedEnd}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {monthlyLoading ? (
          <div className="text-muted-foreground text-sm">Loading chart...</div>
        ) : monthlyError ? (
          <div className="text-red-500 text-sm">Error: {monthlyError}</div>
        ) : (
          <ChartContainer config={{ default: { label: "Revenue Chart", color: "hsl(var(--primary))" } }}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="revenue"
                type="monotone"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Membership revenue over selected period
        </div>
      </CardFooter>
    </Card>
  )
}

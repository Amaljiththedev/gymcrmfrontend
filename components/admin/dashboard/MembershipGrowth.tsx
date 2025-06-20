"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  startDate: string // ISO string: "2025-01-01"
  endDate: string   // ISO string: "2025-06-30"
}

export function EnrollmentSummaryChart({ startDate, endDate }: Props) {
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
    enrollments: item.enrollments,
  }))

  const formattedStart = new Date(startDate).toLocaleDateString()
  const formattedEnd = new Date(endDate).toLocaleDateString()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Summary</CardTitle>
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
          <ChartContainer config={{ responsive: { label: "Responsive", color: "blue" } }}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="enrollments"
                fill="hsl(var(--primary))"
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Monthly enrollment summary
        </div>
      </CardFooter>
    </Card>
  )
}

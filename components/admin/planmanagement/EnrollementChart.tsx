"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Dummy Data for Initial Display
const dummyData = [
  { month: "Jan", enrollments: 120 },
  { month: "Feb", enrollments: 200 },
  { month: "Mar", enrollments: 150 },
  { month: "Apr", enrollments: 300 },
  { month: "May", enrollments: 250 },
  { month: "Jun", enrollments: 400 },
];

// API Fetching Function (Future Backend Integration)
async function fetchEnrollmentData() {
  try {
    const response = await fetch("/api/enrollments"); // Replace with your actual API endpoint
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return dummyData; // Fallback to dummy data if API fails
  }
}

export function EnrollmentChart() {
  const [chartData, setChartData] = useState(dummyData);

  // Fetch Data When Component Mounts (Replace Dummy Data Later)
  useEffect(() => {
    fetchEnrollmentData().then(setChartData);
  }, []);

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-white text-lg">📊 Enrollment Trends</CardTitle>
        <CardDescription className="text-muted-foreground">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--foreground)" }} />
            <YAxis tick={{ fill: "var(--foreground)" }} />
            <Tooltip cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="enrollments" fill="hsl(var(--chart-1))" radius={8} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm text-white">
        <TrendingUp className="h-4 w-4 text-green-500" />
        Trending up by 5.2% this month
      </CardFooter>
    </Card>
  );
}

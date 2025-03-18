"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// Dummy data for membership plans
const plans = [
  { id: 1, name: "Basic", duration: 30, price: 19.99, is_locked: false, enrollments: 150, revenue: 2998.50 },
  { id: 2, name: "Pro", duration: 90, price: 49.99, is_locked: true, enrollments: 200, revenue: 9998.00 },
  { id: 3, name: "Elite", duration: 180, price: 79.99, is_locked: false, enrollments: 130, revenue: 10398.70 },
  { id: 4, name: "Annual", duration: 365, price: 149.99, is_locked: false, enrollments: 220, revenue: 32997.80 },
];

// Calculate KPI metrics
const totalPlans = plans.length;
const highestEnrollmentPlan = plans.reduce(
  (prev, current) => (current.enrollments > prev.enrollments ? current : prev),
  plans[0]
);
const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0);

// Dummy data for enrollment trends (line chart)
const enrollmentTrends = [
  { month: "Jan", enrollments: 50 },
  { month: "Feb", enrollments: 75 },
  { month: "Mar", enrollments: 60 },
  { month: "Apr", enrollments: 80 },
  { month: "May", enrollments: 90 },
  { month: "Jun", enrollments: 100 },
];

export default function MembershipPlanReport() {
  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Membership Plan Report</h1>
        <div className="flex flex-wrap items-center gap-4">
          <select className="p-2 border rounded">
            <option value="all">All Plans</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.name}>
                {plan.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input type="date" className="p-2 border rounded" />
            <input type="date" className="p-2 border rounded" />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Export</button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500">Total Plans</p>
          <p className="text-2xl font-bold">{totalPlans}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500">Highest Enrollments</p>
          <p className="text-2xl font-bold">
            {highestEnrollmentPlan.name} ({highestEnrollmentPlan.enrollments})
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Visual Data Representations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart: Enrollment per Plan */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Enrollments per Plan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={plans}>
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="enrollments" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart: Revenue Share */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Revenue Share</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={plans} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {plans.map((plan, index) => (
                  <Cell key={`cell-${index}`} fill={["#3f51b5", "#009688", "#ff9800", "#e91e63"][index % 4]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart: Enrollment Trends Over Time */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-2">Enrollment Trends Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={enrollmentTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip />
            <Line type="monotone" dataKey="enrollments" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white p-4 rounded shadow mb-8 overflow-x-auto">
        <h2 className="text-xl font-bold mb-2">Detailed Plan Data</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Plan Name</th>
              <th className="border p-2 text-left">Duration (days)</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Locked</th>
              <th className="border p-2 text-left">Enrollments</th>
              <th className="border p-2 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td className="border p-2">{plan.name}</td>
                <td className="border p-2">{plan.duration}</td>
                <td className="border p-2">${plan.price.toFixed(2)}</td>
                <td className="border p-2">{plan.is_locked ? "Yes" : "No"}</td>
                <td className="border p-2">{plan.enrollments}</td>
                <td className="border p-2">${plan.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Insights & Recommendations */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-2">Additional Insights & Recommendations</h2>
        <ul className="list-disc ml-5">
          <li>Identify underperforming plans and consider promotional offers.</li>
          <li>Review customer feedback to improve plan features.</li>
          <li>Adjust pricing strategies based on enrollment trends.</li>
          <li>Monitor renewal rates and plan upgrade opportunities.</li>
        </ul>
      </div>
    </div>
  );
}

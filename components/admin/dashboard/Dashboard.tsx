"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionCards } from "./Sectioncard";
import { MembershipGrowth } from "./membershipgrowth";
import { DataTableDemo } from "./Datatable";

export default function MainDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 bg-gray-800 rounded-md shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-center md:text-left">
          Welcome Admin
        </h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Cards Section */}
        <Card className="bg-gray-800 shadow-md rounded-md">
          <CardContent className="p-4">
            <SectionCards />
          </CardContent>
        </Card>

        {/* Grid Layout for Membership Growth and Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Membership Growth Section */}
          <Card className="bg-gray-800 shadow-md rounded-md">
            <CardHeader>
              <CardTitle>📈 Membership Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <MembershipGrowth />
            </CardContent>
          </Card>

          {/* Recent Payments Section */}
          <Card className="bg-gray-800 shadow-md rounded-md">
            <CardHeader>
              <CardTitle>💳 Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTableDemo />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


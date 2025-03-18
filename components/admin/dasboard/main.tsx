import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./Overview";
import Analytics from "./Analytics";
import Reports from "./Reports";

export default function MainDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="p-4">
      {/* Tabs for Navigation */}
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList className="flex gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Conditional Rendering of Sections */}
      {tab === "overview" && <Overview />}
      {tab === "analytics" && <Analytics />}
      {tab === "reports" && <Reports />}
    </div>
  );
}
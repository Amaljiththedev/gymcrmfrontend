// app/admin/memberlist/page.tsx
"use client";
import * as React from "react";
import CreateRegularStaff from "@/components/admin/staff_management/addregularstaff";

export default function Memberlist() {
  return (
    <>

      {/* Member Table */}
      <CreateRegularStaff />
    </>
  );
}

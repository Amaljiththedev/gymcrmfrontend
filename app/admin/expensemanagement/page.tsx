// app/admin/memberlist/page.tsx
"use client";
import * as React from "react";
import { Box, Button, Typography } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import MemberTable from "@/components/admin/user_management/memberlist"; // Your Member Table Component
import StaffTable from "@/components/admin/staff_management/stafflist";
import ExpenseTable from "@/components/admin/expensemanagement/expensetable";

export default function ExpenseList() {
  return (
    <>
      {/* Breadcrumb Navigation */}

      {/* Member Table */}
      <ExpenseTable />
    </>
  );
}

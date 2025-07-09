// app/admin/memberlist/page.tsx
"use client";
import * as React from "react";
import { Box, Button, Typography } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SuperStaff from "@/components/admin/staff_management/superstaff";
import RegularStaffPage from "@/components/admin/staff_management/regualrstaff";
import CreateSuperStaff from "@/components/admin/staff_management/addsuperstaff";

export default function page() {
  return (
    <>
      <CreateSuperStaff />
    </>
  );
}

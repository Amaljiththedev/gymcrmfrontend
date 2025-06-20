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
import MyProfile from "@/components/admin/settings/Settings";

export default function Settings() {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="large" />}
          sx={{ pl: 0 }}
        >
          <Link underline="none" color="neutral" href="/admin/dashboard">
            <HomeRoundedIcon />
          </Link>
          <Link underline="hover" color="neutral" href="/admin/staff" sx={{ fontSize: 12, fontWeight: 500 }}>
          Settings
          </Link>

        </Breadcrumbs>
      </Box>

      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          mb: 2,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
      </Box>

      {/* Member Table */}
      < MyProfile/>
    </>
  );
}
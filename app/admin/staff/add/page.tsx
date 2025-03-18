// app/admin/memberlist/page.tsx
"use client";
import * as React from "react";
import { Box, Button, Typography } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ActiveMembersTable from "@/components/admin/user_management/activemembers";
import MemberEnrollmentForm from "@/components/admin/user_management/add_form";
import StaffCreationForm from "@/components/admin/staff_management/add_form";

export default function MemberForm() {
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
            Staff Management
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
      <StaffCreationForm />
    </>
  );
}

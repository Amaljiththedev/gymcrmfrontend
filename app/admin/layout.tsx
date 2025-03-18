"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/joy/Box";
import Sidebar from "@/components/admin/layout/header";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logoutManager, refreshToken } from "@/src/store/authSlice";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  
  const [checkedAuth, setCheckedAuth] = useState(false); // Track auth check

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          await dispatch(refreshToken()).unwrap();
        }
        setCheckedAuth(true);
      } catch {
        dispatch(logoutManager());
        router.push("/");
      }
    };

    if (!checkedAuth) {
      checkAuth();
    }
  }, [isAuthenticated, dispatch, router, checkedAuth]);

  // Prevent layout rendering until authentication is confirmed
  if (loading || !checkedAuth) {
    return null; // Or show a loader
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            px: { xs: 2, md: 6 },
            pt: { xs: "calc(12px + var(--Header-height))", md: 3 },
            pb: { xs: 2, md: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

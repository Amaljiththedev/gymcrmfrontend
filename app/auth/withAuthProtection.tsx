"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logoutManager, refreshToken } from "@/src/store/authSlice";

export default function withAuthProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (!isAuthenticated) {
            await dispatch(refreshToken()).unwrap();
          }
          setCheckedAuth(true);
        } catch (error) {
          console.warn("Token expired or user not authenticated");
          dispatch(logoutManager());
          router.push("/");
        }
      };

      if (!checkedAuth) checkAuth();
    }, [checkedAuth, isAuthenticated, dispatch, router]);

    if (loading || !checkedAuth) {
      return (
        <div className="flex items-center justify-center h-screen text-white bg-black">
          <div className="text-lg animate-pulse">Verifying session...</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

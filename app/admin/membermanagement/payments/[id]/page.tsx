"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchPaymentHistory } from "@/src/features/payments/paymentSlice";
import { downloadInvoice, clearInvoice } from "@/src/features/invoice/invoiceSlice";
import {
  Box,
  Button,
  CssVarsProvider,
  Sheet,
  Typography,
  Table,
  Stack,
  Tooltip,
} from "@mui/joy";
import { extendTheme } from "@mui/joy/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import DownloadIcon from "@mui/icons-material/Download";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define a dark theme
const darkTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#000",
          surface: "rgba(0, 0, 0, 0.8)",
          level1: "rgba(20, 20, 20, 0.9)",
          level2: "rgba(35, 35, 35, 0.8)",
        },
        primary: {
          softColor: "#fff",
          softBg: "rgba(60, 60, 60, 0.5)",
        },
        neutral: {
          outlinedBg: "rgba(45, 45, 45, 0.6)",
          outlinedColor: "#fff",
          plainColor: "#fff",
          plainHoverBg: "rgba(60, 60, 60, 0.5)",
        },
        text: {
          primary: "#fff",
          secondary: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  },
});

export default function PaymentHistoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error } = useSelector((state: RootState) => state.payment);
  const { invoiceUrl, error: invoiceError } = useSelector((state: RootState) => state.invoice);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Use your environment variable or fallback to localhost
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

  useEffect(() => {
    if (id) {
      dispatch(fetchPaymentHistory(id as string));
    }
  }, [dispatch, id]);

  // Listen for invoiceUrl changes and trigger download/notifications
  useEffect(() => {
    if (invoiceUrl) {
      toast.dismiss("downloading");
      toast.success("Invoice downloaded successfully");
      const a = document.createElement("a");
      a.href = invoiceUrl;
      a.download = `invoice.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      dispatch(clearInvoice());
    }
    if (invoiceError) {
      toast.dismiss("downloading");
      toast.error(`Error: ${invoiceError}`);
    }
  }, [invoiceUrl, invoiceError, dispatch]);

  const paginatedHistory = history.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Dispatch Redux action for invoice download and show toast notification
  const handleDownloadInvoice = (invoiceId: number) => {
    if (!id) return;
    toast.info("Invoice downloading...", { toastId: "downloading" });
    // Here we assume "id" is the memberId
    if (typeof id === "string") {
      dispatch(downloadInvoice({ memberId: parseInt(id), invoiceId }));
    }
  };

  // Determine the member's first name from the payment history if available.
  // If there are no records or the field doesn't exist, fallback to the member id.
  const memberName =
    history.length > 0 && (history[0] as any).firstName
      ? (history[0] as any).firstName
      : id;

  return (
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      <Box sx={{ p: 3 }}>
        <Typography level="h4" mb={2} sx={{ color: "#fff" }}>
          Payment History for Member {memberName}
        </Typography>

        {loading ? (
          <Typography sx={{ color: "#fff" }}>Loading...</Typography>
        ) : error ? (
          <Typography sx={{ color: "danger" }}>
            Error: {error || "Failed to load payment history"}
          </Typography>
        ) : history.length === 0 ? (
          <Typography sx={{ color: "#fff" }}>No payment history found.</Typography>
        ) : (
          <>
            <Sheet
              variant="outlined"
              sx={{
                width: "100%",
                borderRadius: "sm",
                overflow: "auto",
                bgcolor: "rgba(20, 20, 20, 0.6)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <Table
                stickyHeader
                hoverRow
                sx={{
                  "--TableCell-headBackground": "rgba(25, 25, 25, 0.9)",
                  "--Table-headerUnderlineThickness": "1px",
                  "--TableRow-hoverBackground": "rgba(40, 40, 40, 0.5)",
                  "--TableCell-paddingY": "8px",
                  "--TableCell-paddingX": "12px",
                  color: "#fff",
                  "& thead th": {
                    color: "#fff",
                    fontWeight: "bold",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "& tbody td": {
                    color: "rgba(255, 255, 255, 0.9)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "& tbody tr:hover td": { color: "#fff" },
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>ID</th>
                    <th style={{ width: "25%" }}>Plan</th>
                    <th style={{ width: "15%" }}>Type</th>
                    <th style={{ width: "15%" }}>Payment (₹)</th>
                    <th style={{ width: "10%" }}>Cycle</th>
                    <th style={{ width: "15%" }}>Date</th>
                    <th style={{ width: "15%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistory.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.plan_name_snapshot}</td>
                      <td>{record.transaction_type}</td>
                      <td>₹{record.payment_amount}</td>
                      <td>{record.renewal_count}</td>
                      <td>{new Date(record.transaction_date).toLocaleDateString()}</td>
                      <td>
                        <Tooltip title="Download Invoice">
                          <Button
                            variant="solid"
                            size="sm"
                            color="success"
                            startDecorator={<DownloadIcon />}
                            onClick={() => handleDownloadInvoice(record.id)}
                            sx={{
                              bgcolor: "rgba(40, 120, 40, 0.3)",
                              "&:hover": { bgcolor: "rgba(40, 120, 40, 0.5)" },
                            }}
                          >
                            Invoice
                          </Button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>

            {/* Pagination */}
            <Box
              sx={{
                pt: 2,
                gap: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography level="body-sm" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Showing {Math.min(history.length, (page + 1) * rowsPerPage)} of {history.length} payments
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  startDecorator={<KeyboardArrowLeftIcon />}
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
                    "&.Mui-disabled": {
                      color: "rgba(255, 255, 255, 0.3)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  endDecorator={<KeyboardArrowRightIcon />}
                  disabled={page >= Math.ceil(history.length / rowsPerPage) - 1}
                  onClick={() => setPage(page + 1)}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
                    "&.Mui-disabled": {
                      color: "rgba(255, 255, 255, 0.3)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Next
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
      {/* ToastContainer renders toast notifications */}
      <ToastContainer />
    </CssVarsProvider>
  );
}

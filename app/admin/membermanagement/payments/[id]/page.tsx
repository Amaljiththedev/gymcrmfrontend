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
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from "@mui/joy";
import { extendTheme } from "@mui/joy/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Apple-inspired theme with refined colors and typography
const appleTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#000000",
          surface: "rgba(28, 28, 30, 0.95)",
          level1: "rgba(44, 44, 46, 0.95)",
          level2: "rgba(58, 58, 60, 0.9)",
        },
        primary: {
          50: "#E3F2FD",
          100: "#BBDEFB", 
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#42A5F5",
          500: "#007AFF", // Apple blue
          600: "#1E88E5",
          700: "#1976D2",
          800: "#1565C0",
          900: "#0D47A1",
          solidBg: "#007AFF",
          solidHoverBg: "#0056CC",
          softBg: "rgba(0, 122, 255, 0.12)",
          softHoverBg: "rgba(0, 122, 255, 0.20)",
        },
        success: {
          500: "#34C759", // Apple green
          solidBg: "#34C759",
          solidHoverBg: "#28A745",
          softBg: "rgba(52, 199, 89, 0.12)",
        },
        neutral: {
          50: "#F2F2F7",
          100: "#E5E5EA",
          200: "#D1D1D6",
          300: "#C7C7CC",
          400: "#AEAEB2",
          500: "#8E8E93",
          600: "#636366",
          700: "#48484A",
          800: "#3A3A3C",
          900: "#1C1C1E",
          outlinedBg: "rgba(99, 99, 102, 0.08)",
          outlinedColor: "#F2F2F7",
          plainColor: "#F2F2F7",
          plainHoverBg: "rgba(99, 99, 102, 0.12)",
        },
        text: {
          primary: "#F2F2F7",
          secondary: "rgba(242, 242, 247, 0.6)",
          tertiary: "rgba(242, 242, 247, 0.3)",
        },
      },
    },
  },
  fontFamily: {
    body: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
    display: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
  },
  typography: {
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.025em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
      letterSpacing: "-0.02em",
    },
    "body-sm": {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  radius: {
    sm: "12px",
    md: "16px",
    lg: "20px",
  },
  shadow: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.12)",
    md: "0 4px 16px rgba(0, 0, 0, 0.16)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.24)",
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
      toast.success("Invoice downloaded successfully", {
        position: "top-right",
        style: {
          background: "rgba(28, 28, 30, 0.95)",
          color: "#F2F2F7",
          borderRadius: "12px",
          backdropFilter: "blur(20px)",
        },
      });
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
      toast.error(`Download failed: ${invoiceError}`, {
        position: "top-right",
        style: {
          background: "rgba(28, 28, 30, 0.95)",
          color: "#F2F2F7",
          borderRadius: "12px",
          backdropFilter: "blur(20px)",
        },
      });
    }
  }, [invoiceUrl, invoiceError, dispatch]);

  const paginatedHistory = history.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Dispatch Redux action for invoice download and show toast notification
  const handleDownloadInvoice = (invoiceId: number) => {
    if (!id) return;
    toast.info("Preparing your invoice...", { 
      toastId: "downloading",
      position: "top-right",
      style: {
        background: "rgba(28, 28, 30, 0.95)",
        color: "#F2F2F7",
        borderRadius: "12px",
        backdropFilter: "blur(20px)",
      },
    });
    // Here we assume "id" is the memberId
    if (typeof id === "string") {
      dispatch(downloadInvoice({ memberId: parseInt(id), invoiceId }));
    }
  };

  // Determine the member's first name from the payment history if available.
  const memberName =
    history.length > 0 && (history[0] as any).firstName
      ? (history[0] as any).firstName
      : `Member ${id}`;

  // Calculate summary statistics
  const totalPayments = history.reduce((sum, record) => sum + Number(record.payment_amount), 0);
  const totalTransactions = history.length;
  const mostRecentPayment = history.length > 0 ? history[0].transaction_date : null;

  // Helper function to get transaction type color and variant
  const getTransactionChip = (type: string) => {
    switch (type.toLowerCase()) {
      case 'subscription':
        return { color: 'primary' as const, variant: 'soft' as const, icon: <TrendingUpIcon /> };
      case 'renewal':
        return { color: 'success' as const, variant: 'soft' as const, icon: <TrendingUpIcon /> };
      case 'payment':
        return { color: 'neutral' as const, variant: 'soft' as const, icon: <AccountBalanceWalletIcon /> };
      default:
        return { color: 'neutral' as const, variant: 'outlined' as const, icon: <ReceiptIcon /> };
    }
  };

  return (
    <CssVarsProvider theme={appleTheme} defaultMode="dark">
      <Box sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1200px",
        mx: "auto",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, rgba(28, 28, 30, 0.8) 100%)",
      }}>
        {/* Header Section with Apple-style cards */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: "primary.solidBg", width: 48, height: 48 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography level="h4" sx={{ color: "text.primary", mb: 0.5 }}>
                Payment History
              </Typography>
              <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                Complete transaction record for {memberName}
              </Typography>
            </Box>
          </Box>
          
          {/* Summary Cards */}
          {history.length > 0 && (
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              sx={{ mb: 4 }}
            >
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: 1,
                  bgcolor: "rgba(44, 44, 46, 0.6)",
                  borderColor: "rgba(99, 99, 102, 0.2)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(99, 99, 102, 0.2)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "success.softBg", color: "success.500" }}>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                    <Box>
                      <Typography level="h4" sx={{ color: "text.primary" }}>
                        ₹{totalPayments.toLocaleString()}
                      </Typography>
                      <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                        Total Amount Paid
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: 1,
                  bgcolor: "rgba(44, 44, 46, 0.6)",
                  borderColor: "rgba(99, 99, 102, 0.2)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(99, 99, 102, 0.2)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.softBg", color: "primary.500" }}>
                      <ReceiptIcon />
                    </Avatar>
                    <Box>
                      <Typography level="h4" sx={{ color: "text.primary" }}>
                        {totalTransactions}
                      </Typography>
                      <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                        Total Transactions
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: 1,
                  bgcolor: "rgba(44, 44, 46, 0.6)",
                  borderColor: "rgba(99, 99, 102, 0.2)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(99, 99, 102, 0.2)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "neutral.softBg", color: "neutral.500" }}>
                      <CalendarTodayIcon />
                    </Avatar>
                    <Box>
                      <Typography level="body-lg" sx={{ color: "text.primary", fontWeight: 600 }}>
                        {mostRecentPayment 
                          ? new Date(mostRecentPayment).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'N/A'
                        }
                      </Typography>
                      <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                        Last Payment
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          )}
        </Box>

        {loading ? (
          <Card sx={{ 
            bgcolor: "rgba(44, 44, 46, 0.6)",
            borderColor: "rgba(99, 99, 102, 0.2)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
            py: 8,
          }}>
            <CardContent>
              <Typography level="body-lg" sx={{ color: "text.secondary" }}>
                Loading your payment history...
              </Typography>
            </CardContent>
          </Card>
        ) : error ? (
          <Card sx={{ 
            bgcolor: "rgba(255, 59, 48, 0.1)",
            borderColor: "rgba(255, 59, 48, 0.3)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
            py: 6,
          }}>
            <CardContent>
              <Typography level="h4" sx={{ color: "#FF3B30", mb: 1 }}>
                Unable to Load Payment History
              </Typography>
              <Typography level="body-md" sx={{ color: "text.secondary" }}>
                {error || "An unexpected error occurred while fetching your payment data."}
              </Typography>
            </CardContent>
          </Card>
        ) : history.length === 0 ? (
          <Card sx={{ 
            bgcolor: "rgba(44, 44, 46, 0.6)",
            borderColor: "rgba(99, 99, 102, 0.2)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
            py: 8,
          }}>
            <CardContent>
              <Avatar sx={{ 
                bgcolor: "neutral.softBg", 
                color: "neutral.500", 
                width: 64, 
                height: 64, 
                mx: "auto", 
                mb: 2 
              }}>
                <ReceiptIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography level="h4" sx={{ color: "text.primary", mb: 1 }}>
                No Payment History
              </Typography>
              <Typography level="body-md" sx={{ color: "text.secondary" }}>
                This member hasn't made any payments yet.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Enhanced Table */}
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                bgcolor: "rgba(44, 44, 46, 0.6)",
                borderColor: "rgba(99, 99, 102, 0.2)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(99, 99, 102, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Table
                stickyHeader
                hoverRow
                sx={{
                  "--TableCell-headBackground": "rgba(58, 58, 60, 0.9)",
                  "--Table-headerUnderlineThickness": "0px",
                  "--TableRow-hoverBackground": "rgba(99, 99, 102, 0.1)",
                  "--TableCell-paddingY": "16px",
                  "--TableCell-paddingX": "20px",
                  color: "text.primary",
                  "& thead th": {
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid rgba(99, 99, 102, 0.2)",
                    py: 2,
                  },
                  "& tbody td": {
                    color: "text.primary",
                    borderBottom: "1px solid rgba(99, 99, 102, 0.1)",
                    fontSize: "0.9rem",
                  },
                  "& tbody tr:hover td": { 
                    color: "text.primary",
                    bgcolor: "rgba(99, 99, 102, 0.08)",
                  },
                  "& tbody tr:last-child td": {
                    borderBottom: "none",
                  },
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "8%" }}>Transaction ID</th>
                    <th style={{ width: "28%" }}>Membership Plan</th>
                    <th style={{ width: "18%" }}>Transaction Type</th>
                    <th style={{ width: "15%" }}>Amount</th>
                    <th style={{ width: "10%" }}>Cycle</th>
                    <th style={{ width: "15%" }}>Date</th>
                    <th style={{ width: "6%" }}>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistory.map((record, index) => {
                    const chipProps = getTransactionChip(record.transaction_type);
                    return (
                      <tr key={record.id}>
                        <td>
                          <Typography level="body-sm" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                            #{record.id}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-md" sx={{ fontWeight: 500 }}>
                            {record.plan_name_snapshot}
                          </Typography>
                        </td>
                        <td>
                          <Chip
                            variant={chipProps.variant}
                            color={chipProps.color}
                            startDecorator={chipProps.icon}
                            size="sm"
                            sx={{ 
                              textTransform: "capitalize",
                              fontWeight: 500,
                              fontSize: "0.775rem",
                            }}
                          >
                            {record.transaction_type}
                          </Chip>
                        </td>
                        <td>
                          <Typography level="body-md" sx={{ fontWeight: 600, color: "success.500" }}>
                            ₹{record.payment_amount.toLocaleString()}
                          </Typography>
                        </td>
                        <td>
                          <Chip variant="outlined" color="neutral" size="sm">
                            {record.renewal_count}
                          </Chip>
                        </td>
                        <td>
                          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                            {new Date(record.transaction_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Typography>
                        </td>
                        <td>
                          <Tooltip title="Download Receipt" placement="top">
                            <Button
                              variant="soft"
                              color="primary"
                              size="sm"
                              onClick={() => handleDownloadInvoice(record.id)}
                              sx={{
                                minHeight: 32,
                                minWidth: 32,
                                p: 0,
                                borderRadius: "8px",
                                "&:hover": { 
                                  transform: "scale(1.05)",
                                  transition: "transform 0.2s ease",
                                },
                              }}
                            >
                              <DownloadIcon sx={{ fontSize: 16 }} />
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Sheet>

            {/* Enhanced Pagination */}
            <Box
              sx={{
                pt: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                Showing {page * rowsPerPage + 1}–{Math.min(history.length, (page + 1) * rowsPerPage)} of {history.length} transactions
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="neutral"
                  size="sm"
                  startDecorator={<KeyboardArrowLeftIcon />}
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  sx={{
                    borderRadius: "12px",
                    px: 3,
                    py: 1,
                    color: "text.primary",
                    borderColor: "rgba(99, 99, 102, 0.3)",
                    bgcolor: "rgba(44, 44, 46, 0.4)",
                    backdropFilter: "blur(10px)",
                    "&:hover": { 
                      bgcolor: "rgba(99, 99, 102, 0.2)",
                      borderColor: "rgba(99, 99, 102, 0.4)",
                    },
                    "&.Mui-disabled": {
                      color: "text.tertiary",
                      borderColor: "rgba(99, 99, 102, 0.1)",
                      bgcolor: "rgba(44, 44, 46, 0.2)",
                    },
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  color="neutral"
                  size="sm"
                  endDecorator={<KeyboardArrowRightIcon />}
                  disabled={page >= Math.ceil(history.length / rowsPerPage) - 1}
                  onClick={() => setPage(page + 1)}
                  sx={{
                    borderRadius: "12px",
                    px: 3,
                    py: 1,
                    color: "text.primary",
                    borderColor: "rgba(99, 99, 102, 0.3)",
                    bgcolor: "rgba(44, 44, 46, 0.4)",
                    backdropFilter: "blur(10px)",
                    "&:hover": { 
                      bgcolor: "rgba(99, 99, 102, 0.2)",
                      borderColor: "rgba(99, 99, 102, 0.4)",
                    },
                    "&.Mui-disabled": {
                      color: "text.tertiary",
                      borderColor: "rgba(99, 99, 102, 0.1)",
                      bgcolor: "rgba(44, 44, 46, 0.2)",
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
      
      {/* Enhanced ToastContainer */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          background: "rgba(28, 28, 30, 0.95)",
          color: "#F2F2F7",
          borderRadius: "12px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(99, 99, 102, 0.2)",
        }}
      />
    </CssVarsProvider>
  );
}
"use client";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchMembers } from "@/src/features/members/memberSlice";
import type { RootState, AppDispatch } from "@/src/store/store";
import {
  Avatar,
  Box,
  Chip,
  Typography,
  Input,
  Sheet,
  Button,
  Table,
  FormControl,
  FormLabel,
  Select,
  Option,
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  Dropdown,
  IconButton,
  CssVarsProvider,
  extendTheme,
  Stack,
  Tooltip,
  Card,
  CardContent,
} from "@mui/joy";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ColorPaletteProp } from "@mui/joy/styles";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';

// Apple-inspired theme with system-like colors
const appleTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#000000",
          surface: "rgba(28, 28, 30, 0.98)",
          level1: "rgba(44, 44, 46, 0.95)",
          level2: "rgba(58, 58, 60, 0.9)",
        },
        primary: {
          50: "#e3f2fd",
          100: "#bbdefb",
          200: "#90caf9",
          300: "#64b5f6",
          400: "#42a5f5",
          500: "#007AFF", // Apple blue
          600: "#1976d2",
          700: "#1565c0",
          800: "#0d47a1",
          900: "#0a3d62",
          plainColor: "#007AFF",
          solidBg: "#007AFF",
          solidHoverBg: "#0056CC",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#1c1c1e",
          plainColor: "rgba(255, 255, 255, 0.86)",
          outlinedBg: "rgba(44, 44, 46, 0.8)",
          outlinedColor: "rgba(255, 255, 255, 0.86)",
          outlinedBorder: "rgba(99, 99, 102, 0.4)",
          plainHoverBg: "rgba(99, 99, 102, 0.16)",
        },
        text: {
          primary: "rgba(255, 255, 255, 0.92)",
          secondary: "rgba(235, 235, 245, 0.6)",
          tertiary: "rgba(235, 235, 245, 0.3)",
        },
        success: {
          solidBg: "#30D158", // Apple green
          plainColor: "#30D158",
        },
        warning: {
          solidBg: "#FF9F0A", // Apple orange
          plainColor: "#FF9F0A",
        },
        danger: {
          solidBg: "#FF453A", // Apple red
          plainColor: "#FF453A",
        },
      },
    },
  },
  fontFamily: {
    body: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
  },
  radius: {
    xs: "6px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  shadow: {
    xs: "0 1px 3px rgba(0, 0, 0, 0.2)",
    sm: "0 2px 8px rgba(0, 0, 0, 0.15)",
    md: "0 4px 16px rgba(0, 0, 0, 0.1)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.08)",
    xl: "0 12px 48px rgba(0, 0, 0, 0.06)",
  },
});

type Order = "asc" | "desc";
type SortKey = "id" | "first_name" | "phone" | "amount_paid" | "membership_status";
type MembershipStatus = "active" | "expired" | "blocked" | "expiring" | "payment_due";

// Utility function to compare two members for sorting
function descendingComparator(a: any, b: any, orderBy: SortKey) {
  if ((b[orderBy] ?? 0) < (a[orderBy] ?? 0)) return -1;
  if ((b[orderBy] ?? 0) > (a[orderBy] ?? 0)) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: SortKey) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  return phone.startsWith("+91") ? phone : `+91 ${phone}`;
};

// Apple-style status mapping with refined colors
const statusMapping: Record<
  MembershipStatus,
  { color: ColorPaletteProp; bgColor: string; textColor: string; icon: JSX.Element }
> = {
  active: {
    color: "success",
    bgColor: "rgba(48, 209, 88, 0.15)",
    textColor: "#30D158",
    icon: <CheckRoundedIcon sx={{ fontSize: "14px" }} />,
  },
  expired: {
    color: "neutral",
    bgColor: "rgba(99, 99, 102, 0.15)",
    textColor: "rgba(235, 235, 245, 0.6)",
    icon: <AutorenewRoundedIcon sx={{ fontSize: "14px" }} />,
  },
  blocked: {
    color: "danger",
    bgColor: "rgba(255, 69, 58, 0.15)",
    textColor: "#FF453A",
    icon: <BlockIcon sx={{ fontSize: "14px" }} />,
  },
  expiring: {
    color: "warning",
    bgColor: "rgba(255, 159, 10, 0.15)",
    textColor: "#FF9F0A",
    icon: <AccessTimeIcon sx={{ fontSize: "14px" }} />,
  },
  payment_due: {
    color: "primary",
    bgColor: "rgba(0, 122, 255, 0.15)",
    textColor: "#007AFF",
    icon: <PaymentIcon sx={{ fontSize: "14px" }} />,
  },
};

export default function AppleMemberTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { members } = useSelector((state: RootState) => state.members);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<SortKey>("first_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
        const searchFields = [fullName, member.email, member.phone].join(" ").toLowerCase();
        const statusMatch = statusFilter === "all" || member.membership_status === statusFilter;
        const fullyPaid = Number(member.amount_paid) >= Number(member.membership_plan.price);
        const amountMatch =
          amountFilter === "all" ||
          (amountFilter === "paid" && fullyPaid) ||
          (amountFilter === "unpaid" && !fullyPaid);
        const planMatch = planFilter === "all" || member.membership_plan.name === planFilter;
        return (
          searchFields.includes(searchTerm.toLowerCase()) &&
          statusMatch &&
          amountMatch &&
          planMatch
        );
      })
      .sort(getComparator(order, orderBy));
  }, [members, searchTerm, statusFilter, amountFilter, planFilter, order, orderBy]);

  const handleRequestSort = (property: SortKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewMember = (id: number) => {
    router.push(`/admin/membermanagement/view/${id}`);
  };

  const handleEditMember = (id: number) => {
    router.push(`/admin/membermanagement/edit/${id}`);
  };

  const handleBlockMember = async (id: number) => {
    // Call your real API here, e.g.:
    // await memberApi.updateMemberStatus(id, "blocked");
    // Optionally refresh members after
    // dispatch(fetchMembers());
  };

  const renderFilters = () => (
    <>
      <FormControl size="sm" sx={{ minWidth: 140 }}>
        <FormLabel sx={{ 
          color: "text.secondary", 
          fontSize: "13px", 
          fontWeight: 500,
          letterSpacing: "-0.08px"
        }}>
          Status
        </FormLabel>
        <Select
          size="sm"
          value={statusFilter}
          onChange={(e, newValue) => setStatusFilter(newValue || "all")}
          placeholder="All Statuses"
          sx={{
            bgcolor: "rgba(44, 44, 46, 0.6)",
            border: "1px solid rgba(99, 99, 102, 0.3)",
            borderRadius: "8px",
            color: "text.primary",
            fontSize: "14px",
            fontWeight: 400,
            backdropFilter: "blur(20px)",
            "&:hover": { 
              bgcolor: "rgba(44, 44, 46, 0.8)",
              borderColor: "rgba(99, 99, 102, 0.5)"
            },
            "&:focus-within": {
              borderColor: "primary.500",
              boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)"
            }
          }}
        >
          <Option value="all">All Statuses</Option>
          <Option value="active">Active</Option>
          <Option value="expired">Expired</Option>
          <Option value="blocked">Blocked</Option>
          <Option value="expiring">Expiring</Option>
          <Option value="payment_due">Payment Due</Option>
        </Select>
      </FormControl>
      
      <FormControl size="sm" sx={{ minWidth: 140 }}>
        <FormLabel sx={{ 
          color: "text.secondary", 
          fontSize: "13px", 
          fontWeight: 500,
          letterSpacing: "-0.08px"
        }}>
          Payment
        </FormLabel>
        <Select
          size="sm"
          value={amountFilter}
          onChange={(e, newValue) => setAmountFilter(newValue || "all")}
          placeholder="All Payments"
          sx={{
            bgcolor: "rgba(44, 44, 46, 0.6)",
            border: "1px solid rgba(99, 99, 102, 0.3)",
            borderRadius: "8px",
            color: "text.primary",
            fontSize: "14px",
            fontWeight: 400,
            backdropFilter: "blur(20px)",
            "&:hover": { 
              bgcolor: "rgba(44, 44, 46, 0.8)",
              borderColor: "rgba(99, 99, 102, 0.5)"
            },
            "&:focus-within": {
              borderColor: "primary.500",
              boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)"
            }
          }}
        >
          <Option value="all">All Payments</Option>
          <Option value="paid">Fully Paid</Option>
          <Option value="unpaid">Outstanding</Option>
        </Select>
      </FormControl>
      
      <FormControl size="sm" sx={{ minWidth: 140 }}>
        <FormLabel sx={{ 
          color: "text.secondary", 
          fontSize: "13px", 
          fontWeight: 500,
          letterSpacing: "-0.08px"
        }}>
          Plan
        </FormLabel>
        <Select
          size="sm"
          value={planFilter}
          onChange={(e, newValue) => setPlanFilter(newValue || "all")}
          placeholder="All Plans"
          sx={{
            bgcolor: "rgba(44, 44, 46, 0.6)",
            border: "1px solid rgba(99, 99, 102, 0.3)",
            borderRadius: "8px",
            color: "text.primary",
            fontSize: "14px",
            fontWeight: 400,
            backdropFilter: "blur(20px)",
            "&:hover": { 
              bgcolor: "rgba(44, 44, 46, 0.8)",
              borderColor: "rgba(99, 99, 102, 0.5)"
            },
            "&:focus-within": {
              borderColor: "primary.500",
              boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)"
            }
          }}
        >
          <Option value="all">All Plans</Option>
          <Option value="Basic">Basic</Option>
          <Option value="Premium">Premium</Option>
          <Option value="Gold">Gold</Option>
        </Select>
      </FormControl>
    </>
  );

  return (
    <CssVarsProvider theme={appleTheme} defaultMode="dark">
      <Box sx={{ 
        minHeight: "100vh", 
        bgcolor: "background.body",
        p: { xs: 2, sm: 3, md: 4 },
        fontFamily: "body"
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            level="h1" 
            sx={{ 
              fontSize: { xs: "28px", sm: "32px", md: "36px" },
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
              letterSpacing: "-0.025em"
            }}
          >
            Members
          </Typography>
          <Typography 
            level="body-md" 
            sx={{ 
              color: "text.secondary",
              fontSize: "17px",
              fontWeight: 400
            }}
          >
            Manage your gym members, track payments, and monitor memberships
          </Typography>
        </Box>

        {/* Mobile Search & Filters */}
        <Sheet
          sx={{
            display: { xs: "flex", sm: "none" },
            mb: 3,
            gap: 2,
            bgcolor: "transparent"
          }}
        >
          <Input
            size="md"
            placeholder="Search members..."
            startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "18px" }} />}
            sx={{
              flexGrow: 1,
              bgcolor: "rgba(44, 44, 46, 0.6)",
              border: "1px solid rgba(99, 99, 102, 0.3)",
              borderRadius: "12px",
              color: "text.primary",
              fontSize: "16px",
              backdropFilter: "blur(20px)",
              "&:hover": { 
                bgcolor: "rgba(44, 44, 46, 0.8)",
                borderColor: "rgba(99, 99, 102, 0.5)"
              },
              "&:focus-within": {
                borderColor: "primary.500",
                boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)"
              },
              "& input::placeholder": { 
                color: "text.secondary",
                opacity: 1
              }
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton
            size="md"
            variant="outlined"
            onClick={() => setIsFilterOpen(true)}
            sx={{ 
              borderRadius: "12px",
              bgcolor: "rgba(44, 44, 46, 0.6)",
              borderColor: "rgba(99, 99, 102, 0.3)",
              color: "text.primary",
              backdropFilter: "blur(20px)",
              "&:hover": { 
                bgcolor: "rgba(44, 44, 46, 0.8)",
                borderColor: "rgba(99, 99, 102, 0.5)"
              }
            }}
          >
            <FilterAltIcon />
          </IconButton>
        </Sheet>

        {/* Desktop Search & Filters */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: { sm: "column", lg: "row" },
            gap: 3,
            mb: 4,
            p: 3,
            bgcolor: "rgba(44, 44, 46, 0.4)",
            borderRadius: "16px",
            border: "1px solid rgba(99, 99, 102, 0.2)",
            backdropFilter: "blur(20px)"
          }}
        >
          <FormControl sx={{ flex: 1, maxWidth: { lg: "400px" } }}>
            <FormLabel sx={{ 
              color: "text.secondary", 
              fontSize: "13px", 
              fontWeight: 500,
              mb: 1,
              letterSpacing: "-0.08px"
            }}>
              Search Members
            </FormLabel>
            <Input
              size="md"
              placeholder="Search by name, email, or phone number..."
              startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "18px" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: "rgba(44, 44, 46, 0.6)",
                border: "1px solid rgba(99, 99, 102, 0.3)",
                borderRadius: "10px",
                color: "text.primary",
                fontSize: "15px",
                fontWeight: 400,
                backdropFilter: "blur(20px)",
                "&:hover": { 
                  bgcolor: "rgba(44, 44, 46, 0.8)",
                  borderColor: "rgba(99, 99, 102, 0.5)"
                },
                "&:focus-within": {
                  borderColor: "primary.500",
                  boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)"
                },
                "& input::placeholder": { 
                  color: "text.secondary",
                  opacity: 1
                }
              }}
            />
          </FormControl>
          
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            flexWrap: "wrap",
            alignItems: "end"
          }}>
            {renderFilters()}
          </Box>
        </Box>

        {/* Main Table Container */}
        <Sheet
          variant="outlined"
          sx={{
            borderRadius: "16px",
            bgcolor: "rgba(44, 44, 46, 0.4)",
            border: "1px solid rgba(99, 99, 102, 0.2)",
            backdropFilter: "blur(20px)",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)"
          }}
        >
          {/* Desktop Table */}
          <Table
            hoverRow
            sx={{
              display: { xs: "none", md: "table" },
              "--TableCell-headBackground": "rgba(58, 58, 60, 0.6)",
              "--TableCell-paddingY": "16px",
              "--TableCell-paddingX": "20px",
              "--TableRow-hoverBackground": "rgba(99, 99, 102, 0.08)",
              fontSize: "15px",
              "& thead th": { 
                color: "text.primary", 
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderBottom: "1px solid rgba(99, 99, 102, 0.2)"
              },
              "& tbody td": {
                color: "text.primary",
                borderBottom: "1px solid rgba(99, 99, 102, 0.1)",
                fontSize: "15px"
              },
              "& tbody tr:hover td": { 
                color: "text.primary"
              }
            }}
          >
            <thead>
              <tr>
                {[
                  { id: "id", label: "ID" },
                  { id: "first_name", label: "Member" },
                  { id: "phone", label: "Contact" },
                  { id: "amount_paid", label: "Payment" },
                  { id: "membership_status", label: "Status" },
                  { id: "actions", label: "Actions" }
                ].map((headCell) => (
                  <th key={headCell.id}>
                    {headCell.id !== "actions" ? (
                      <Button
                        variant="plain"
                        onClick={() => handleRequestSort(headCell.id as SortKey)}
                        endDecorator={
                          orderBy === headCell.id ? (
                            <ArrowDropDownIcon 
                              sx={{ 
                                transform: order === "asc" ? "rotate(180deg)" : "none",
                                transition: "transform 0.2s",
                                fontSize: "18px"
                              }} 
                            />
                          ) : null
                        }
                        sx={{
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: "13px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          bgcolor: "transparent",
                          "&:hover": { bgcolor: "rgba(99, 99, 102, 0.1)" }
                        }}
                      >
                        {headCell.label}
                      </Button>
                    ) : (
                      headCell.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMembers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((member) => (
                  <tr key={member.id}>
                    <td>
                      <Typography 
                        sx={{ 
                          color: "text.secondary",
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: "SF Mono, Monaco, monospace"
                        }}
                      >
                        #{member.id.toString().padStart(4, '0')}
                      </Typography>
                    </td>
                    <td>
                      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                        <Avatar
                          size="md"
                          src={member.photo}
                          sx={{
                            bgcolor: member.photo ? "transparent" : "rgba(0, 122, 255, 0.15)",
                            color: member.photo ? "inherit" : "primary.500",
                            fontSize: "16px",
                            fontWeight: 600,
                            width: 40,
                            height: 40
                          }}
                        >
                          {!member.photo && `${member.first_name[0]}${member.last_name[0]}`}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{ 
                              color: "text.primary",
                              fontSize: "15px",
                              fontWeight: 500,
                              mb: 0.5,
                              lineHeight: 1.2
                            }}
                          >
                            {member.first_name} {member.last_name}
                          </Typography>
                          <Typography 
                            sx={{ 
                              color: "text.secondary",
                              fontSize: "13px",
                              fontWeight: 400
                            }}
                          >
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>
                    </td>
                    <td>
                      <Typography 
                        sx={{ 
                          color: "text.primary",
                          fontSize: "14px",
                          fontWeight: 400,
                          fontFamily: "SF Mono, Monaco, monospace"
                        }}
                      >
                        {formatPhoneNumber(member.phone?.toString() || "")}
                      </Typography>
                    </td>
                    <td>
                      <Box>
                        <Typography 
                          sx={{ 
                            color: "text.primary",
                            fontSize: "15px",
                            fontWeight: 600,
                            mb: 0.5
                          }}
                        >
                          ₹{member.amount_paid.toLocaleString()}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: "text.secondary",
                            fontSize: "12px",
                            fontWeight: 400
                          }}
                        >
                          {member.membership_plan.name} • ₹{member.membership_plan.price.toLocaleString()}
                        </Typography>
                      </Box>
                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        size="sm"
                        startDecorator={statusMapping[member.membership_status as MembershipStatus].icon}
                        sx={{
                          bgcolor: statusMapping[member.membership_status as MembershipStatus].bgColor,
                          color: statusMapping[member.membership_status as MembershipStatus].textColor,
                          fontSize: "12px",
                          fontWeight: 500,
                          textTransform: "capitalize",
                          borderRadius: "8px",
                          px: 1.5,
                          py: 0.5,
                          border: "none"
                        }}
                      >
                        {member.membership_status.replace('_', ' ')}
                      </Chip>
                    </td>
                    <td>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Details" placement="top">
                          <IconButton
                            size="sm"
                            variant="plain"
                            onClick={() => handleViewMember(member.id)}
                            sx={{ 
                              color: "text.secondary",
                              borderRadius: "8px",
                              "&:hover": { 
                                bgcolor: "rgba(99, 99, 102, 0.1)",
                                color: "text.primary"
                              }
                            }}
                          >
                            <VisibilityIcon sx={{ fontSize: "18px" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Member" placement="top">
                          <IconButton
                            size="sm"
                            variant="plain"
                            onClick={() => handleEditMember(member.id)}
                            sx={{ 
                              color: "text.secondary",
                              borderRadius: "8px",
                              "&:hover": { 
                                bgcolor: "rgba(99, 99, 102, 0.1)",
                                color: "text.primary"
                              }
                            }}
                          >
                            <EditIcon sx={{ fontSize: "18px" }} />
                          </IconButton>
                        </Tooltip>
                        <Dropdown>
                          <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{
                              root: {
                                variant: "plain",
                                size: "sm",
                                sx: { 
                                  color: "text.secondary",
                                  borderRadius: "8px",
                                  "&:hover": { 
                                    bgcolor: "rgba(99, 99, 102, 0.1)",
                                    color: "text.primary"
                                  }
                                }
                              }
                            }}
                          >
                            <MoreHorizRoundedIcon sx={{ fontSize: "18px" }} />
                          </MenuButton>
                          <Menu
                            size="sm"
                            sx={{
                              minWidth: 200,
                              bgcolor: "rgba(44, 44, 46, 0.95)",
                              border: "1px solid rgba(99, 99, 102, 0.3)",
                              borderRadius: "12px",
                              backdropFilter: "blur(20px)",
                              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                              py: 1,
                              "& .MuiMenuItem-root": {
                                color: "text.primary",
                                fontSize: "14px",
                                fontWeight: 400,
                                borderRadius: "8px",
                                mx: 1,
                                my: 0.5,
                                "&:hover": { 
                                  bgcolor: "rgba(99, 99, 102, 0.15)"
                                }
                              }
                            }}
                          >
                            <MenuItem 
                              onClick={() => handleBlockMember(member.id)}
                              sx={{ 
                                color: member.membership_status === "blocked" ? "success.plainColor" : "danger.plainColor"
                              }}
                            >
                              {member.membership_status === "blocked" ? "Unblock Member" : "Block Member"}
                            </MenuItem>
                            <Divider sx={{ 
                              bgcolor: "rgba(99, 99, 102, 0.2)",
                              my: 1,
                              mx: 1
                            }} />
                            <MenuItem onClick={() => router.push(`/admin/membermanagement/payments/${member.id}`)}>
                              Payment History
                            </MenuItem>
                            <MenuItem onClick={() => router.push(`/admin/membermanagement/renewal/${member.id}`)}>
                              Membership Renewal
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </Stack>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {/* Mobile List View */}
          <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
            {filteredMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <Card 
                  key={member.id} 
                  sx={{ 
                    mb: 2,
                    bgcolor: "rgba(58, 58, 60, 0.6)",
                    border: "1px solid rgba(99, 99, 102, 0.2)",
                    borderRadius: "12px",
                    backdropFilter: "blur(20px)",
                    "&:hover": {
                      bgcolor: "rgba(58, 58, 60, 0.8)",
                      borderColor: "rgba(99, 99, 102, 0.3)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
                      <Avatar
                        size="lg"
                        src={member.photo}
                        sx={{
                          bgcolor: member.photo ? "transparent" : "rgba(0, 122, 255, 0.15)",
                          color: member.photo ? "inherit" : "primary.500",
                          fontSize: "18px",
                          fontWeight: 600,
                          width: 48,
                          height: 48
                        }}
                      >
                        {!member.photo && `${member.first_name[0]}${member.last_name[0]}`}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Typography
                            sx={{ 
                              color: "text.primary",
                              fontSize: "16px",
                              fontWeight: 600,
                              lineHeight: 1.2
                            }}
                          >
                            {member.first_name} {member.last_name}
                          </Typography>
                          <Typography 
                            sx={{ 
                              color: "text.secondary",
                              fontSize: "12px",
                              fontWeight: 500,
                              fontFamily: "SF Mono, Monaco, monospace"
                            }}
                          >
                            #{member.id.toString().padStart(4, '0')}
                          </Typography>
                        </Box>
                        <Typography 
                          sx={{ 
                            color: "text.secondary",
                            fontSize: "14px",
                            fontWeight: 400,
                            mb: 0.5
                          }}
                        >
                          {member.email}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: "text.secondary",
                            fontSize: "14px",
                            fontWeight: 400,
                            fontFamily: "SF Mono, Monaco, monospace"
                          }}
                        >
                          {formatPhoneNumber(member.phone?.toString() || "")}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Box>
                        <Typography 
                          sx={{ 
                            color: "text.primary",
                            fontSize: "16px",
                            fontWeight: 600,
                            mb: 0.5
                          }}
                        >
                          ₹{member.amount_paid.toLocaleString()}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: "text.secondary",
                            fontSize: "12px",
                            fontWeight: 400
                          }}
                        >
                          {member.membership_plan.name} Plan
                        </Typography>
                      </Box>
                      
                      <Chip
                        variant="soft"
                        size="sm"
                        startDecorator={statusMapping[member.membership_status as MembershipStatus].icon}
                        sx={{
                          bgcolor: statusMapping[member.membership_status as MembershipStatus].bgColor,
                          color: statusMapping[member.membership_status as MembershipStatus].textColor,
                          fontSize: "11px",
                          fontWeight: 500,
                          textTransform: "capitalize",
                          borderRadius: "8px",
                          px: 1.5,
                          py: 0.5,
                          border: "none"
                        }}
                      >
                        {member.membership_status.replace('_', ' ')}
                      </Chip>
                    </Box>
                    
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                      <IconButton
                        size="sm"
                        variant="soft"
                        onClick={() => handleViewMember(member.id)}
                        sx={{ 
                          bgcolor: "rgba(0, 122, 255, 0.15)",
                          color: "primary.500",
                          borderRadius: "8px",
                          "&:hover": { 
                            bgcolor: "rgba(0, 122, 255, 0.25)"
                          }
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                      <IconButton
                        size="sm"
                        variant="soft"
                        onClick={() => handleEditMember(member.id)}
                        sx={{ 
                          bgcolor: "rgba(99, 99, 102, 0.15)",
                          color: "text.secondary",
                          borderRadius: "8px",
                          "&:hover": { 
                            bgcolor: "rgba(99, 99, 102, 0.25)",
                            color: "text.primary"
                          }
                        }}
                      >
                        <EditIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Sheet>

        {/* Pagination */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Typography 
            sx={{ 
              color: "text.secondary",
              fontSize: "14px",
              fontWeight: 400
            }}
          >
            Showing {Math.min(filteredMembers.length, (page + 1) * rowsPerPage)} of {filteredMembers.length} members
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              size="sm"
              variant="soft"
              startDecorator={<KeyboardArrowLeftIcon />}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              sx={{
                bgcolor: "rgba(44, 44, 46, 0.6)",
                color: "text.primary",
                border: "1px solid rgba(99, 99, 102, 0.3)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                "&:hover": { 
                  bgcolor: "rgba(44, 44, 46, 0.8)",
                  borderColor: "rgba(99, 99, 102, 0.5)"
                },
                "&.Mui-disabled": {
                  color: "text.tertiary",
                  bgcolor: "rgba(44, 44, 46, 0.3)",
                  borderColor: "rgba(99, 99, 102, 0.1)"
                }
              }}
            >
              Previous
            </Button>
            
            <Box sx={{ 
              display: { xs: "none", sm: "flex" }, 
              gap: 0.5,
              mx: 1
            }}>
              {Array.from({ length: Math.ceil(filteredMembers.length / rowsPerPage) }, (_, i) => (
                <IconButton
                  key={i}
                  size="sm"
                  variant={page === i ? "soft" : "plain"}
                  onClick={() => setPage(i)}
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: page === i ? "primary.500" : "text.secondary",
                    bgcolor: page === i ? "rgba(0, 122, 255, 0.15)" : "transparent",
                    "&:hover": { 
                      bgcolor: page === i ? "rgba(0, 122, 255, 0.25)" : "rgba(99, 99, 102, 0.1)",
                      color: page === i ? "primary.500" : "text.primary"
                    }
                  }}
                >
                  {i + 1}
                </IconButton>
              ))}
            </Box>
            
            <Button
              size="sm"
              variant="soft"
              endDecorator={<KeyboardArrowRightIcon />}
              disabled={page >= Math.ceil(filteredMembers.length / rowsPerPage) - 1}
              onClick={() => setPage(page + 1)}
              sx={{
                bgcolor: "rgba(44, 44, 46, 0.6)",
                color: "text.primary",
                border: "1px solid rgba(99, 99, 102, 0.3)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                "&:hover": { 
                  bgcolor: "rgba(44, 44, 46, 0.8)",
                  borderColor: "rgba(99, 99, 102, 0.5)"
                },
                "&.Mui-disabled": {
                  color: "text.tertiary",
                  bgcolor: "rgba(44, 44, 46, 0.3)",
                  borderColor: "rgba(99, 99, 102, 0.1)"
                }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>

        {/* Mobile Filter Modal */}
        <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
          <ModalDialog
            layout="fullscreen"
            sx={{ 
              bgcolor: "background.body",
              color: "text.primary",
              p: 0
            }}
          >
            <Box sx={{ p: 3, borderBottom: "1px solid rgba(99, 99, 102, 0.2)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography 
                  level="h4" 
                  sx={{ 
                    color: "text.primary",
                    fontSize: "20px",
                    fontWeight: 600
                  }}
                >
                  Filters
                </Typography>
                <ModalClose 
                  sx={{ 
                    color: "text.secondary",
                    position: "static",
                    "&:hover": { color: "text.primary" }
                  }} 
                />
              </Box>
            </Box>
            
            <Box sx={{ p: 3, flex: 1 }}>
              <Stack spacing={3}>
                {renderFilters()}
              </Stack>
            </Box>
            
            <Box sx={{ 
              p: 3, 
              borderTop: "1px solid rgba(99, 99, 102, 0.2)",
              bgcolor: "rgba(44, 44, 46, 0.4)"
            }}>
              <Button
                fullWidth
                onClick={() => setIsFilterOpen(false)}
                sx={{
                  bgcolor: "primary.500",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 600,
                  borderRadius: "12px",
                  py: 1.5,
                  "&:hover": { bgcolor: "primary.600" }
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      </Box>
    </CssVarsProvider>
  );
}
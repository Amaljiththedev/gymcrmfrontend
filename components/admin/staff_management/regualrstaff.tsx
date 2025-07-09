"use client";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import {
  fetchRegularStaff,
  Staff,
} from "@/src/features/staff/staffSlice";
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
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
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
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

// Enhanced Apple-inspired theme with improved colors and animations
const appleTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#000000",
          surface: "rgba(28, 28, 30, 0.95)",
          level1: "rgba(44, 44, 46, 0.98)",
          level2: "rgba(58, 58, 60, 0.95)",
          level3: "rgba(72, 72, 74, 0.90)",
        },
        primary: {
          solidBg: "#007AFF",
          solidHoverBg: "#0056CC",
          solidColor: "#FFFFFF",
          softBg: "rgba(0, 122, 255, 0.12)",
          softColor: "#64B5F6",
          softHoverBg: "rgba(0, 122, 255, 0.20)",
          plainColor: "#007AFF",
          plainHoverBg: "rgba(0, 122, 255, 0.08)",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F7",
          200: "#E5E5EA",
          300: "#D1D1D6",
          400: "#C7C7CC",
          500: "#AEAEB2",
          600: "#8E8E93",
          700: "#636366",
          800: "#48484A",
          900: "#1C1C1E",
          outlinedBg: "rgba(44, 44, 46, 0.8)",
          outlinedColor: "#F2F2F7",
          outlinedBorder: "rgba(84, 84, 88, 0.4)",
          plainColor: "#F2F2F7",
          plainHoverBg: "rgba(72, 72, 74, 0.25)",
        },
        text: {
          primary: "#F2F2F7",
          secondary: "rgba(235, 235, 245, 0.68)",
          tertiary: "rgba(235, 235, 245, 0.38)",
        },
        divider: "rgba(84, 84, 88, 0.4)",
        success: {
          solidBg: "#34C759",
          softBg: "rgba(52, 199, 89, 0.12)",
          softColor: "#34C759",
        },
        danger: {
          solidBg: "#FF3B30",
          softBg: "rgba(255, 59, 48, 0.12)",
          softColor: "#FF453A",
        },
        warning: {
          solidBg: "#FF9500",
          softBg: "rgba(255, 149, 0, 0.12)",
          softColor: "#FF9F0A",
        },
      },
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.02em",
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.015em",
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      fontSize: "1.25rem",
    },
    "body-lg": {
      fontWeight: 400,
      letterSpacing: "-0.005em",
      fontSize: "1.125rem",
    },
    "body-md": {
      fontWeight: 400,
      letterSpacing: "-0.003em",
      fontSize: "1rem",
    },
    "body-sm": {
      fontWeight: 400,
      letterSpacing: "-0.002em",
      fontSize: "0.875rem",
    },
    "body-xs": {
      fontWeight: 400,
      letterSpacing: "-0.001em",
      fontSize: "0.75rem",
    },
  },
  fontFamily: {
    body: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif",
    display: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif",
  },
  radius: {
    xs: "6px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },
  shadow: {
    xs: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    sm: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    md: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
    lg: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
    xl: "0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)",
  },
});

type Order = "asc" | "desc";
type SortKey = "id" | "first_name" | "phone_number" | "salary" | "role";

function descendingComparator(a: Staff, b: Staff, orderBy: SortKey) {
  const aVal = a[orderBy] ?? "";
  const bVal = b[orderBy] ?? "";
  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: SortKey) {
  return order === "desc"
    ? (a: Staff, b: Staff) => descendingComparator(a, b, orderBy)
    : (a: Staff, b: Staff) => -descendingComparator(a, b, orderBy);
}

export default function RegularStaffTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { regularStaff } = useSelector((state: RootState) => state.staff);
  const staffList = regularStaff;

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<SortKey>("first_name");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRegularStaff());
  }, [dispatch]);

  const filteredStaff = useMemo(() => {
    return staffList
      .filter((s) => {
        const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
        const matchSearch =
          fullName.includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.phone_number.includes(searchTerm);
        const matchRole = roleFilter === "all" || s.role === roleFilter;
        return matchSearch && matchRole;
      })
      .sort(getComparator(order, orderBy));
  }, [staffList, searchTerm, roleFilter, order, orderBy]);

  const handleSort = (key: SortKey) => {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  };

  const handleView = (id: number) => {
    const staff = staffList.find((s) => s.id === id);
    setSelectedStaff(staff || null);
    setIsViewModalOpen(true);
  };
  
  const handleEdit = (id: number) => router.push(`/admin/staff/edit/${id}`);
  const handleSalaryHistory = (id: number) => router.push(`/admin/staff/salary-history/${id}`);
  const handleBlock = (id: number) => console.log("Block/Unblock", id);

  // Enhanced filter controls with better Apple styling
  const renderFilters = () => (
    <FormControl size="sm">
      <FormLabel sx={{ 
        color: "text.secondary", 
        fontSize: "13px", 
        fontWeight: 500,
        mb: 0.5,
        textTransform: "none",
        letterSpacing: "-0.01em"
      }}>
        Role
      </FormLabel>
      <Select
        size="sm"
        value={roleFilter}
        onChange={(e, val) => setRoleFilter(val || "all")}
        sx={{
          minWidth: 140,
          bgcolor: "background.level1",
          border: "1px solid",
          borderColor: "neutral.outlinedBorder",
          borderRadius: "10px",
          color: "text.primary",
          fontSize: "14px",
          fontWeight: 400,
          backdropFilter: "blur(20px)",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": { 
            borderColor: "neutral.300",
            bgcolor: "background.level2",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
          },
          "&:focus-within": {
            borderColor: "primary.solidBg",
            boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.12)",
            transform: "translateY(-1px)",
          },
          "& .MuiSelect-indicator": { 
            color: "text.secondary",
            transition: "color 0.2s ease"
          },
        }}
      >
        <Option value="all">All Roles</Option>
        <Option value="regular_staff">Regular Staff</Option>
        <Option value="super_staff" disabled>Super Staff</Option>
      </Select>
    </FormControl>
  );

  return (
    <CssVarsProvider theme={appleTheme} defaultMode="dark">
      <Box sx={{ 
        maxWidth: "100%", 
        mx: "auto", 
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
        bgcolor: "background.body"
      }}>
        {/* Enhanced Header Section */}
        <Box sx={{ mb: 5 }}>
          <Typography level="h2" sx={{ 
            color: "text.primary", 
            mb: 1.5,
            fontSize: { xs: "28px", sm: "32px", md: "36px" },
            fontWeight: 700,
            letterSpacing: "-0.025em",
            background: "linear-gradient(135deg, #F2F2F7 0%, rgba(235, 235, 245, 0.8) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Regular Staff Directory
          </Typography>
          <Typography level="body-lg" sx={{ 
            color: "text.secondary",
            fontSize: "17px",
            fontWeight: 400,
            letterSpacing: "-0.01em"
          }}>
            Manage your regular staff members and their information
          </Typography>
        </Box>

        {/* Enhanced Mobile Search & Filter */}
        <Sheet
          sx={{
            display: { xs: "flex", sm: "none" },
            mb: 4,
            gap: 2,
            bgcolor: "transparent",
            boxShadow: "none",
          }}
        >
          <Input
            size="lg"
            placeholder="Search staff..."
            startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "20px" }} />}
            sx={{
              flexGrow: 1,
              bgcolor: "background.level1",
              border: "1px solid",
              borderColor: "neutral.outlinedBorder",
              borderRadius: "14px",
              color: "text.primary",
              fontSize: "16px",
              py: 2,
              backdropFilter: "blur(20px)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { 
                borderColor: "neutral.300",
                bgcolor: "background.level2",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
              },
              "&:focus-within": {
                borderColor: "primary.solidBg",
                boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.12)",
                transform: "translateY(-1px)",
              },
              "& .MuiInput-input::placeholder": { 
                color: "text.tertiary",
                fontSize: "16px"
              },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            size="lg"
            variant="outlined"
            startDecorator={<FilterAltIcon />}
            onClick={() => setIsFilterOpen(true)}
            sx={{ 
              borderRadius: "14px",
              borderColor: "neutral.outlinedBorder",
              color: "text.primary",
              bgcolor: "background.level1",
              backdropFilter: "blur(20px)",
              minWidth: "52px",
              px: 2.5,
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { 
                bgcolor: "background.level2",
                borderColor: "neutral.300",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
              }
            }}
          >
            Filter
          </Button>

          {/* Enhanced Mobile Filter Modal */}
          <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
            <ModalDialog
              layout="center"
              sx={{
                bgcolor: "rgba(28, 28, 30, 0.95)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "rgba(84, 84, 88, 0.3)",
                p: 4,
                minWidth: "340px",
                maxWidth: "420px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                animation: "modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "@keyframes modalSlideIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(20px) scale(0.95)"
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0) scale(1)"
                  }
                }
              }}
            >
              <ModalClose sx={{ 
                color: "text.secondary",
                "&:hover": { 
                  bgcolor: "rgba(72, 72, 74, 0.3)",
                  color: "text.primary"
                }
              }} />
              <Typography level="h3" sx={{ 
                color: "text.primary",
                mb: 3,
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "-0.015em"
              }}>
                Filter Staff
              </Typography>
              <Box sx={{ mb: 4 }}>
                {renderFilters()}
              </Box>
              <Button
                fullWidth
                size="lg"
                onClick={() => setIsFilterOpen(false)}
                sx={{ 
                  bgcolor: "primary.solidBg",
                  color: "primary.solidColor",
                  borderRadius: "12px",
                  py: 2,
                  fontSize: "16px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  "&:hover": { 
                    bgcolor: "primary.solidHoverBg",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 16px rgba(0, 122, 255, 0.3)"
                  }
                }}
              >
                Apply Filters
              </Button>
            </ModalDialog>
          </Modal>
        </Sheet>

        {/* Enhanced Desktop Search & Filter */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 4,
            mb: 5,
            alignItems: "flex-end",
          }}
        >
          <FormControl sx={{ flex: 1, maxWidth: "450px" }}>
            <FormLabel sx={{ 
              color: "text.secondary", 
              fontSize: "14px", 
              fontWeight: 500,
              mb: 1,
              textTransform: "none",
              letterSpacing: "-0.01em"
            }}>
              Search
            </FormLabel>
            <Input
              size="lg"
              placeholder="Search by name, email, or phone"
              startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "20px" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: "background.level1",
                border: "1px solid",
                borderColor: "neutral.outlinedBorder",
                borderRadius: "12px",
                color: "text.primary",
                fontSize: "15px",
                py: 1.8,
                backdropFilter: "blur(20px)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { 
                  borderColor: "neutral.300",
                  bgcolor: "background.level2",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                },
                "&:focus-within": {
                  borderColor: "primary.solidBg",
                  boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.12)",
                  transform: "translateY(-1px)",
                },
                "& .MuiInput-input::placeholder": { 
                  color: "text.tertiary",
                  fontSize: "15px"
                },
              }}
            />
          </FormControl>
          {renderFilters()}
        </Box>

        {/* Enhanced Table Container */}
        <Sheet
          variant="outlined"
          sx={{
            overflow: "hidden",
            bgcolor: "rgba(28, 28, 30, 0.95)",
            backdropFilter: "blur(40px)",
            border: "1px solid",
            borderColor: "rgba(84, 84, 88, 0.3)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)"
            }
          }}
        >
          {/* Enhanced Desktop Table */}
          <Table
            hoverRow
            stickyHeader
            sx={{
              display: { xs: "none", md: "table" },
              "--TableCell-headBackground": "rgba(28, 28, 30, 0.98)",
              "--Table-headerUnderlineThickness": "1px",
              "--TableRow-hoverBackground": "rgba(72, 72, 74, 0.15)",
              "--TableCell-paddingX": "24px",
              "--TableCell-paddingY": "20px",
              "& thead th": { 
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid",
                borderColor: "rgba(84, 84, 88, 0.3)",
                py: 3,
                backdropFilter: "blur(20px)",
              },
              "& tbody td": { 
                borderColor: "rgba(84, 84, 88, 0.2)",
                color: "text.primary",
                fontSize: "15px",
                py: 3,
              },
              "& tbody tr": {
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-1px)",
                }
              }
            }}
          >
            <thead>
              <tr>
                {[
                  { id: "id", label: "ID", sortable: true },
                  { id: "first_name", label: "Staff Member", sortable: true },
                  { id: "phone_number", label: "Contact", sortable: true },
                  { id: "salary", label: "Salary", sortable: true },
                  { id: "role", label: "Role", sortable: true },
                  { id: "actions", label: "Actions", sortable: false },
                ].map((col) => (
                  <th key={col.id}>
                    {col.sortable ? (
                      <Button
                        variant="plain"
                        onClick={() => handleSort(col.id as SortKey)}
                        endDecorator={
                          orderBy === col.id ? (
                            <ArrowDropDownIcon 
                              sx={{ 
                                transform: order === "asc" ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                              }} 
                            />
                          ) : null
                        }
                        sx={{
                          color: "text.secondary",
                          bgcolor: "transparent",
                          fontSize: "13px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          p: 0,
                          minHeight: "auto",
                          transition: "all 0.2s ease",
                          "&:hover": { 
                            bgcolor: "rgba(72, 72, 74, 0.2)",
                            color: "text.primary"
                          },
                        }}
                      >
                        {col.label}
                      </Button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStaff
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Typography level="body-md" sx={{ 
                        color: "text.secondary", 
                        fontWeight: 500,
                        fontFamily: "monospace",
                        fontSize: "14px"
                      }}>
                        #{s.id}
                      </Typography>
                    </td>
                    <td>
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Avatar 
                          src={s.photo} 
                          sx={{ 
                            width: 44, 
                            height: 44,
                            bgcolor: "primary.softBg",
                            color: "primary.solidBg",
                            fontSize: "16px",
                            fontWeight: 600,
                            border: "2px solid",
                            borderColor: "rgba(0, 122, 255, 0.2)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                              borderColor: "primary.solidBg"
                            }
                          }}
                        >
                          {!s.photo && s.first_name[0]}
                        </Avatar>
                        <Box>
                          <Typography level="body-md" sx={{ 
                            fontWeight: 600, 
                            color: "text.primary",
                            fontSize: "15px",
                            letterSpacing: "-0.01em"
                          }}>
                            {s.first_name} {s.last_name}
                          </Typography>
                          <Typography level="body-sm" sx={{ 
                            color: "text.secondary", 
                            mt: 0.5,
                            fontSize: "13px"
                          }}>
                            {s.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </td>
                    <td>
                      <Typography level="body-md" sx={{ 
                        color: "text.primary",
                        fontFamily: "monospace",
                        fontSize: "14px"
                      }}>
                        {s.phone_number}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-md" sx={{ 
                        fontWeight: 600, 
                        color: "success.solidBg",
                        fontSize: "15px"
                      }}>
                        ₹{s.salary?.toLocaleString()}
                      </Typography>
                    </td>
                    <td>
                      <Chip 
                        variant="soft" 
                        color="primary"
                        sx={{
                          bgcolor: "primary.softBg",
                          color: "primary.solidBg",
                          fontSize: "12px",
                          fontWeight: 500,
                          borderRadius: "8px",
                          textTransform: "capitalize",
                          border: "1px solid",
                          borderColor: "rgba(0, 122, 255, 0.2)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "primary.softHoverBg",
                            borderColor: "primary.solidBg"
                          }
                        }}
                      >
                        {s.role?.replace('staff', ' Staff')}
                      </Chip>
                    </td>
                    <td>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Details" placement="top">
                          <IconButton 
                            size="sm" 
                            variant="plain"
                            onClick={() => handleView(s.id)}
                            sx={{
                              color: "text.secondary",
                              bgcolor: "transparent",
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                              "&:hover": { 
                                bgcolor: "primary.softBg",
                                color: "primary.solidBg",
                                transform: "scale(1.1)"
                              }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                          <IconButton 
                            size="sm" 
                            variant="plain"
                            onClick={() => handleEdit(s.id)}
                            sx={{
                              color: "text.secondary",
                              bgcolor: "transparent",
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                              "&:hover": { 
                                bgcolor: "warning.softBg",
                                color: "warning.solidBg",
                                transform: "scale(1.1)"
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Dropdown>
                          <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{
                              root: {
                                size: "sm",
                                variant: "plain",
                                sx: {
                                  color: "text.secondary",
                                  bgcolor: "transparent",
                                  borderRadius: "8px",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: "neutral.800",
                                    color: "primary.solidBg",
                                    transform: "scale(1.1)"
                                  }
                                }
                              }
                            }}
                          >
                            <MoreHorizRoundedIcon fontSize="small" />
                          </MenuButton>
                          <Menu>
                            <MenuItem onClick={() => handleSalaryHistory(s.id)}>
                              <CurrencyRupeeIcon sx={{ fontSize: 18, mr: 1 }} /> Salary History
                            </MenuItem>
                            <MenuItem onClick={() => handleBlock(s.id)}>
                              <BlockIcon sx={{ fontSize: 18, mr: 1 }} /> Block/Unblock
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </Stack>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {/* You can add a pagination component here if needed */}
        </Sheet>
      </Box>
    </CssVarsProvider>
  );
}


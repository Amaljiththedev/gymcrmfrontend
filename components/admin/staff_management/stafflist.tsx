"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import {
  fetchRegularStaff,
  fetchSuperStaff,
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
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Mail, Phone, Badge } from "@mui/icons-material";

// Apple-inspired dark theme
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
          solidBg: "#007AFF",
          solidHoverBg: "#0056CC",
          solidColor: "#FFFFFF",
          softBg: "rgba(0, 122, 255, 0.15)",
          softColor: "#007AFF",
          softHoverBg: "rgba(0, 122, 255, 0.25)",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F7",
          200: "#E5E5EA",
          800: "#2C2C2E",
          900: "#1C1C1E",
          outlinedBg: "rgba(44, 44, 46, 0.8)",
          outlinedColor: "#F2F2F7",
          outlinedBorder: "rgba(84, 84, 88, 0.6)",
          plainColor: "#F2F2F7",
          plainHoverBg: "rgba(72, 72, 74, 0.3)",
        },
        text: {
          primary: "#F2F2F7",
          secondary: "rgba(235, 235, 245, 0.6)",
          tertiary: "rgba(235, 235, 245, 0.3)",
        },
        divider: "rgba(84, 84, 88, 0.6)",
      },
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.005em",
    },
    "body-md": {
      fontWeight: 400,
      letterSpacing: "-0.003em",
    },
    "body-sm": {
      fontWeight: 400,
      letterSpacing: "-0.002em",
    },
    "body-xs": {
      fontWeight: 400,
      letterSpacing: "-0.001em",
    },
  },
  fontFamily: {
    body: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
  },
  radius: {
    xs: "6px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  shadow: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.12)",
    sm: "0 2px 8px rgba(0, 0, 0, 0.16)",
    md: "0 4px 16px rgba(0, 0, 0, 0.24)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.32)",
    xl: "0 16px 64px rgba(0, 0, 0, 0.48)",
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

export default function StaffTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { superStaff, regularStaff } = useSelector((state: RootState) => state.staff);
  const staffList = [...superStaff, ...regularStaff];

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
    dispatch(fetchSuperStaff());
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

  // Render filter controls with Apple styling
  const renderFilters = () => (
    <FormControl size="sm">
      <FormLabel sx={{ 
        color: "text.secondary", 
        fontSize: "13px", 
        fontWeight: 500,
        mb: 0.5,
        textTransform: "none" 
      }}>
        Role
      </FormLabel>
      <Select
        size="sm"
        value={roleFilter}
        onChange={(e, val) => setRoleFilter(val || "all")}
        sx={{
          minWidth: 120,
          bgcolor: "background.level1",
          border: "1px solid",
          borderColor: "neutral.outlinedBorder",
          borderRadius: "8px",
          color: "text.primary",
          fontSize: "14px",
          fontWeight: 400,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": { 
            borderColor: "neutral.200",
            bgcolor: "rgba(58, 58, 60, 0.8)"
          },
          "&:focus-within": {
            borderColor: "primary.solidBg",
            boxShadow: "0 0 0 3px rgba(0, 122, 255, 0.1)",
          },
          "& .MuiSelect-indicator": { color: "text.secondary" },
        }}
      >
        <Option value="all">All Roles</Option>
        <Option value="superstaff">Super Staff</Option>
        <Option value="regularstaff">Regular Staff</Option>
      </Select>
    </FormControl>
  );

  return (
    <CssVarsProvider theme={appleTheme} defaultMode="dark">
      <Box sx={{ maxWidth: "100%", mx: "auto", p: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography level="h2" sx={{ 
            color: "text.primary", 
            mb: 1,
            fontSize: { xs: "24px", sm: "28px" },
            fontWeight: 700,
            letterSpacing: "-0.02em"
          }}>
            Staff Directory
          </Typography>
          <Typography level="body-md" sx={{ 
            color: "text.secondary",
            fontSize: "16px"
          }}>
            Manage your team members and their information
          </Typography>
        </Box>

        {/* Mobile Search & Filter */}
        <Sheet
          sx={{
            display: { xs: "flex", sm: "none" },
            mb: 3,
            gap: 2,
            bgcolor: "transparent",
            boxShadow: "none",
          }}
        >
          <Input
            size="md"
            placeholder="Search staff..."
            startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "20px" }} />}
            sx={{
              flexGrow: 1,
              bgcolor: "background.level1",
              border: "1px solid",
              borderColor: "neutral.outlinedBorder",
              borderRadius: "12px",
              color: "text.primary",
              fontSize: "16px",
              py: 1.5,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { 
                borderColor: "neutral.200",
                bgcolor: "rgba(58, 58, 60, 0.8)"
              },
              "&:focus-within": {
                borderColor: "primary.solidBg",
                boxShadow: "0 0 0 3px rgba(0, 122, 255, 0.1)",
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
            size="md"
            variant="outlined"
            startDecorator={<FilterAltIcon />}
            onClick={() => setIsFilterOpen(true)}
            sx={{ 
              borderRadius: "12px",
              borderColor: "neutral.outlinedBorder",
              color: "text.primary",
              bgcolor: "background.level1",
              minWidth: "48px",
              px: 2,
              "&:hover": { 
                bgcolor: "rgba(58, 58, 60, 0.8)",
                borderColor: "neutral.200"
              }
            }}
          >
            Filter
          </Button>

          {/* Mobile Filter Modal */}
          <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
            <ModalDialog
              layout="center"
              sx={{
                bgcolor: "background.surface",
                backdropFilter: "blur(20px)",
                borderRadius: "16px",
                p: 3,
                minWidth: "320px",
                maxWidth: "400px",
              }}
            >
              <ModalClose sx={{ 
                color: "text.secondary",
                "&:hover": { bgcolor: "rgba(72, 72, 74, 0.3)" }
              }} />
              <Typography level="h3" sx={{ 
                color: "text.primary",
                mb: 3,
                fontSize: "20px",
                fontWeight: 600
              }}>
                Filter Staff
              </Typography>
              <Box sx={{ mb: 3 }}>
                {renderFilters()}
              </Box>
              <Button
                fullWidth
                size="md"
                onClick={() => setIsFilterOpen(false)}
                sx={{ 
                  bgcolor: "primary.solidBg",
                  color: "primary.solidColor",
                  borderRadius: "8px",
                  py: 1.5,
                  fontSize: "16px",
                  fontWeight: 500,
                  "&:hover": { bgcolor: "primary.solidHoverBg" }
                }}
              >
                Apply Filters
              </Button>
            </ModalDialog>
          </Modal>
        </Sheet>

        {/* Desktop Search & Filter */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 3,
            mb: 4,
            alignItems: "flex-end",
          }}
        >
          <FormControl sx={{ flex: 1, maxWidth: "400px" }}>
            <FormLabel sx={{ 
              color: "text.secondary", 
              fontSize: "13px", 
              fontWeight: 500,
              mb: 0.5,
              textTransform: "none" 
            }}>
              Search
            </FormLabel>
            <Input
              size="md"
              placeholder="Search by name, email, or phone"
              startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "20px" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: "background.level1",
                border: "1px solid",
                borderColor: "neutral.outlinedBorder",
                borderRadius: "8px",
                color: "text.primary",
                fontSize: "14px",
                py: 1.2,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { 
                  borderColor: "neutral.200",
                  bgcolor: "rgba(58, 58, 60, 0.8)"
                },
                "&:focus-within": {
                  borderColor: "primary.solidBg",
                  boxShadow: "0 0 0 3px rgba(0, 122, 255, 0.1)",
                },
                "& .MuiInput-input::placeholder": { 
                  color: "text.tertiary",
                  fontSize: "14px"
                },
              }}
            />
          </FormControl>
          {renderFilters()}
        </Box>

        {/* Table Container */}
        <Sheet
          variant="outlined"
          sx={{
            overflow: "hidden",
            bgcolor: "background.surface",
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: "neutral.outlinedBorder",
            borderRadius: "16px",
            boxShadow: "0 4px 32px rgba(0, 0, 0, 0.24)",
          }}
        >
          {/* Desktop Table */}
          <Table
            hoverRow
            stickyHeader
            sx={{
              display: { xs: "none", md: "table" },
              "--TableCell-headBackground": "rgba(28, 28, 30, 0.98)",
              "--Table-headerUnderlineThickness": "1px",
              "--TableRow-hoverBackground": "rgba(72, 72, 74, 0.2)",
              "--TableCell-paddingX": "24px",
              "--TableCell-paddingY": "16px",
              "& thead th": { 
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 2,
              },
              "& tbody td": { 
                borderColor: "divider",
                color: "text.primary",
                fontSize: "14px",
                py: 2,
              },
              "& tbody tr": {
                transition: "background-color 0.15s ease",
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
                                transition: "transform 0.2s ease"
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
                      <Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        #{s.id}
                      </Typography>
                    </td>
                    <td>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          src={s.photo} 
                          sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: "primary.softBg",
                            color: "primary.softColor",
                            fontSize: "16px",
                            fontWeight: 600
                          }}
                        >
                          {!s.photo && s.first_name[0]}
                        </Avatar>
                        <Box>
                          <Typography level="body-md" sx={{ fontWeight: 500, color: "text.primary" }}>
                            {s.first_name} {s.last_name}
                          </Typography>
                          <Typography level="body-sm" sx={{ color: "text.secondary", mt: 0.25 }}>
                            {s.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </td>
                    <td>
                      <Typography level="body-md" sx={{ color: "text.primary" }}>
                        {s.phone_number}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-md" sx={{ fontWeight: 600, color: "text.primary" }}>
                        ₹{s.salary?.toLocaleString()}
                      </Typography>
                    </td>
                    <td>
                      <Chip 
                        variant="soft" 
                        color="primary"
                        sx={{
                          bgcolor: "primary.softBg",
                          color: "primary.softColor",
                          fontSize: "12px",
                          fontWeight: 500,
                          borderRadius: "6px",
                          textTransform: "capitalize"
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
                              borderRadius: "6px",
                              "&:hover": { 
                                bgcolor: "rgba(72, 72, 74, 0.3)",
                                color: "text.primary"
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
                              borderRadius: "6px",
                              "&:hover": { 
                                bgcolor: "rgba(72, 72, 74, 0.3)",
                                color: "text.primary"
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
                                  borderRadius: "6px",
                                  "&:hover": { 
                                    bgcolor: "rgba(72, 72, 74, 0.3)",
                                    color: "text.primary"
                                  }
                                }
                              }
                            }}
                          >
                            <MoreHorizRoundedIcon fontSize="small" />
                          </MenuButton>
                          <Menu
                            sx={{
                              bgcolor: "background.surface",
                              backdropFilter: "blur(20px)",
                              border: "1px solid",
                              borderColor: "neutral.outlinedBorder",
                              borderRadius: "8px",
                              py: 1,
                              "& .MuiMenuItem-root": {
                                borderRadius: "4px",
                                mx: 1,
                                fontSize: "14px",
                                "&:hover": {
                                  bgcolor: "rgba(72, 72, 74, 0.3)"
                                }
                              }
                            }}
                          >
                            <MenuItem onClick={() => handleSalaryHistory(s.id)}>
                              <CurrencyRupeeIcon fontSize="small" sx={{ mr: 1 }} />
                              Salary History
                            </MenuItem>
                            <MenuItem 
                              onClick={() => handleBlock(s.id)}
                              sx={{ color: "#FF3B30" }}
                            >
                              <BlockIcon fontSize="small" sx={{ mr: 1 }} />
                              Block Staff
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </Stack>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {/* Mobile Card List */}
          <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
            {filteredStaff
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((s) => (
              <Card 
                key={s.id} 
                sx={{ 
                  mb: 2,
                  bgcolor: "background.level1",
                  border: "1px solid",
                  borderColor: "neutral.outlinedBorder",
                  borderRadius: "12px",
                  boxShadow: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "neutral.200",
                    bgcolor: "rgba(58, 58, 60, 0.8)"
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    <Avatar 
                      src={s.photo} 
                      sx={{ 
                        width: 48, 
                        height: 48,
                        bgcolor: "primary.softBg",
                        color: "primary.softColor",
                        fontSize: "18px",
                        fontWeight: 600
                      }}
                    >
                      {!s.photo && s.first_name[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box>
                          <Typography level="body-md" sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}>
                            {s.first_name} {s.last_name}
                          </Typography>
                          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                            #{s.id}
                          </Typography>
                        </Box>
                        <Chip 
                          variant="soft" 
                          color="primary"
                          size="sm"
                          sx={{
                            bgcolor: "primary.softBg",
                            color: "primary.softColor",
                            fontSize: "11px",
                            fontWeight: 500,
                            borderRadius: "6px",
                            textTransform: "capitalize"
                          }}
                        >
                          {s.role?.replace('staff', ' Staff')}
                        </Chip>
                      </Stack>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography level="body-sm" sx={{ color: "text.secondary", mb: 0.5 }}>
                          {s.email}
                        </Typography>
                        <Typography level="body-sm" sx={{ color: "text.secondary", mb: 0.5 }}>
                          {s.phone_number}
                        </Typography>
                        <Typography level="body-sm" sx={{ fontWeight: 600, color: "text.primary" }}>
                          ₹{s.salary?.toLocaleString()}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="sm"
                          variant="soft"
                          startDecorator={<VisibilityIcon fontSize="small" />}
                          onClick={() => handleView(s.id)}
                          sx={{
                            bgcolor: "primary.softBg",
                            color: "primary.softColor",
                            fontSize: "13px",
                            borderRadius: "6px",
                            "&:hover": { bgcolor: "primary.softHoverBg" }
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outlined"
                          startDecorator={<EditIcon fontSize="small" />}
                          onClick={() => handleEdit(s.id)}
                          sx={{
                            borderColor: "neutral.outlinedBorder",
                            color: "text.primary",
                            fontSize: "13px",
                            borderRadius: "6px",
                            "&:hover": { 
                              bgcolor: "rgba(72, 72, 74, 0.3)",
                              borderColor: "neutral.200"
                            }
                          }}
                        >
                          Edit
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Sheet>

        {/* Staff Detail Modal */}
        <Modal open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
          <ModalDialog
            sx={{
              minWidth: 380,
              maxWidth: 440,
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              p: 0,
              overflow: "hidden",
              bgcolor: "background.level1"
            }}
          >
            {/* Profile Header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
                px: 3,
                bgcolor: "primary.softBg",
                borderBottom: "1px solid",
                borderColor: "divider"
              }}
            >
              <Avatar
                src={selectedStaff?.photo}
                sx={{
                  width: 72,
                  height: 72,
                  mb: 2,
                  fontSize: 32,
                  bgcolor: "primary.solidBg",
                  color: "primary.solidColor"
                }}
              >
                {selectedStaff?.first_name?.[0]}
              </Avatar>
              <Typography level="h3" sx={{ fontWeight: 700, fontSize: 22, color: "text.primary" }}>
                {selectedStaff?.first_name} {selectedStaff?.last_name}
              </Typography>
              <Typography level="body-md" sx={{ color: "text.secondary", fontSize: 15 }}>
                {selectedStaff?.role}
              </Typography>
            </Box>

            {/* Details Section */}
            <Box sx={{ px: 4, py: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Mail sx={{ color: "primary.solidBg" }} fontSize="small" />
                  <Typography level="body-md" sx={{ color: "text.primary" }}>
                    {selectedStaff?.email}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone sx={{ color: "primary.solidBg" }} fontSize="small" />
                  <Typography level="body-md" sx={{ color: "text.primary" }}>
                    {selectedStaff?.phone_number}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CurrencyRupeeIcon sx={{ color: "primary.solidBg" }} fontSize="small" />
                  <Typography level="body-md" sx={{ color: "text.primary" }}>
                    ₹{selectedStaff?.salary?.toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Badge sx={{ color: "primary.solidBg" }} fontSize="small" />
                  <Typography level="body-md" sx={{ color: "text.primary" }}>
                    Staff ID: #{selectedStaff?.id}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Divider sx={{ my: 1, bgcolor: "divider" }} />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ px: 4, pb: 4 }}>
              <Button
                fullWidth
                variant="soft"
                color="primary"
                startDecorator={<EditIcon />}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedStaff?.id || 0);
                }}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 500
                }}
              >
                Edit Details
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startDecorator={<CurrencyRupeeIcon />}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleSalaryHistory(selectedStaff?.id || 0);
                }}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 500
                }}
              >
                Salary History
              </Button>
            </Stack>
          </ModalDialog>
        </Modal>

        {/* Pagination */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
          }}
        >
          <Button
            size="md"
            variant="outlined"
            startDecorator={<KeyboardArrowLeftIcon />}
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            sx={{
              borderColor: "neutral.outlinedBorder",
              color: "text.primary",
              bgcolor: "background.level1",
              borderRadius: "8px",
              px: 3,
              py: 1.5,
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s ease",
              "&:hover": { 
                bgcolor: "rgba(58, 58, 60, 0.8)",
                borderColor: "neutral.200"
              },
              "&:disabled": {
                color: "text.tertiary",
                borderColor: "rgba(84, 84, 88, 0.3)",
                bgcolor: "transparent"
              }
            }}
          >
            Previous
          </Button>
          
          <Typography level="body-sm" sx={{ 
            color: "text.secondary",
            fontSize: "13px"
          }}>
            Page {page + 1} of {Math.ceil(filteredStaff.length / rowsPerPage)}
          </Typography>
          
          <Button
            size="md"
            variant="outlined"
            endDecorator={<KeyboardArrowRightIcon />}
            disabled={page >= Math.ceil(filteredStaff.length / rowsPerPage) - 1}
            onClick={() => setPage(page + 1)}
            sx={{
              borderColor: "neutral.outlinedBorder",
              color: "text.primary",
              bgcolor: "background.level1",
              borderRadius: "8px",
              px: 3,
              py: 1.5,
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s ease",
              "&:hover": { 
                bgcolor: "rgba(58, 58, 60, 0.8)",
                borderColor: "neutral.200"
              },
              "&:disabled": {
                color: "text.tertiary",
                borderColor: "rgba(84, 84, 88, 0.3)",
                bgcolor: "transparent"
              }
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
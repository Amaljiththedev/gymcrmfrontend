"use client";

import * as React from "react";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
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
  IconButton,
  CssVarsProvider,
  extendTheme,
  Stack,
  Tooltip,
  Card,
  CardContent,
  Chip,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchSuperStaff, Staff } from "@/src/features/staff/staffSlice";

// Apple-inspired theme (copied from stafflist.tsx)
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
type SortKey = "id" | "first_name" | "phone_number" | "department" | "salary" | "role";

function descendingComparator(a: Staff, b: Staff, orderBy: SortKey) {
  const aValue = a[orderBy as keyof Staff];
  const bValue = b[orderBy as keyof Staff];
  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: SortKey) {
  return order === "desc"
    ? (a: Staff, b: Staff) => descendingComparator(a, b, orderBy)
    : (a: Staff, b: Staff) => -descendingComparator(a, b, orderBy);
}

const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  return phone.startsWith("+91") ? phone : `+91 ${phone}`;
};

const headCells = [
  { id: "id", label: "Staff ID", sortable: true },
  { id: "first_name", label: "Staff Details", sortable: true },
  { id: "phone_number", label: "Contact", sortable: true },
  { id: "department", label: "Department", sortable: true },
  { id: "salary", label: "Salary", sortable: true },
  { id: "role", label: "Role", sortable: true },
  { id: "actions", label: "Actions", sortable: false },
];

export default function SuperStaffPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { superStaff: staff, loading, error } = useSelector((state: RootState) => state.staff);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<SortKey>("first_name");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchSuperStaff());
  }, [dispatch]);

  const filteredStaff = useMemo(() => {
    return staff
      .filter((staffMember) => {
        const fullName = `${staffMember.first_name} ${staffMember.last_name}`.toLowerCase();
        const searchFields = [fullName, staffMember.email, staffMember.phone_number].join(" ").toLowerCase();
        const departmentMatch = departmentFilter === "all" || staffMember.department === departmentFilter;
        const roleMatch = roleFilter === "all" || staffMember.role === roleFilter;
        return searchFields.includes(searchTerm.toLowerCase()) && departmentMatch && roleMatch;
      })
      .sort(getComparator(order, orderBy));
  }, [staff, searchTerm, departmentFilter, roleFilter, order, orderBy]);

  const handleRequestSort = (property: SortKey): void => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewStaff = (id: number): void => {
    router.push(`/admin/staff/view/${id}`);
  };

  const handleEditStaff = (id: number): void => {
    router.push(`/admin/staff/edit/${id}`);
  };

  const handleBlockStaff = (id: number): void => {
    console.log(`Block staff member ${id}`);
    // Implement block functionality as needed
  };

  const renderFilters = () => (
    <>
      <FormControl size="sm">
        <FormLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Department</FormLabel>
        <Select
          size="sm"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter((e?.target as HTMLSelectElement).value || "all")}
          placeholder="Filter by department"
          sx={{
            color: "#fff",
            bgcolor: "rgba(30,30,30,0.8)",
            "& .MuiSelect-indicator": { color: "#fff" },
            "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
          }}
        >
          <Option value="all">All</Option>
          <Option value="front_desk">Front Desk</Option>
          <Option value="cleaning">Cleaning Staff</Option>
          <Option value="maintenance">Maintenance</Option>
          <Option value="accounting">Accounting</Option>
          <Option value="security">Security</Option>
          <Option value="sales">Sales & Marketing</Option>
          <Option value="customer_service">Customer Service</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Role</FormLabel>
        <Select
          size="sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter((e?.target as HTMLSelectElement).value || "all")}
          placeholder="Filter by role"
          sx={{
            color: "#fff",
            bgcolor: "rgba(30,30,30,0.8)",
            "& .MuiSelect-indicator": { color: "#fff" },
            "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
          }}
        >
          <Option value="all">All</Option>
          <Option value="regular_staff">Regular Staff</Option>
          <Option value="super_staff">Super Staff</Option>
        </Select>
      </FormControl>
    </>
  );

  const buttonStyles = {
    backgroundColor: "black !important",
    color: "#fff !important",
    "&:hover": {
      backgroundColor: "black !important",
      color: "#fff !important",
    },
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#fff" }}>
        <Typography>Loading Regular Staff...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#fff" }}>
        <Typography>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <CssVarsProvider theme={appleTheme} defaultMode="dark">
      <Box sx={{ maxWidth: "100%", mx: "auto", p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh", bgcolor: "background.body" }}>
        {/* Apple-style Header */}
        <Box sx={{ mb: 5 }}>
          <Typography level="h2" sx={{ color: "text.primary", mb: 1.5, fontSize: { xs: "28px", sm: "32px", md: "36px" }, fontWeight: 700, letterSpacing: "-0.025em", background: "linear-gradient(135deg, #F2F2F7 0%, rgba(235, 235, 245, 0.8) 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Super Staff Directory
          </Typography>
          <Typography level="body-lg" sx={{ color: "text.secondary", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.01em" }}>
            Manage your super staff members and their information
          </Typography>
        </Box>
        {/* Apple-style Search & Filter (Mobile & Desktop) */}
        <Sheet
          sx={{
            display: { xs: "flex", sm: "none" },
            my: 1,
            gap: 1,
            bgcolor: "transparent",
            boxShadow: "none",
          }}
        >
          <Input
            size="sm"
            placeholder="Search staff..."
            startDecorator={<SearchIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
            sx={{
              flexGrow: 1,
              bgcolor: "rgba(30,30,30,0.8)",
              "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
              "& .MuiInput-input::placeholder": { color: "rgba(255,255,255,0.5)" },
            }}
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setIsFilterOpen(true)}
            sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
          >
            <FilterAltIcon />
          </IconButton>
          <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
            <ModalDialog
              aria-labelledby="filter-modal"
              layout="fullscreen"
              sx={{ bgcolor: "#000", color: "#fff" }}
            >
              <ModalClose sx={{ color: "#fff" }} />
              <Typography id="filter-modal" level="h2" sx={{ color: "#fff" }}>
                Filters
              </Typography>
              <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {renderFilters()}
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  sx={{ bgcolor: "rgba(70,130,180,0.8)", color: "#fff" }}
                >
                  Apply Filters
                </Button>
              </Box>
            </ModalDialog>
          </Modal>
        </Sheet>

        {/* Desktop Search & Filters */}
        <Box
          sx={{
            borderRadius: "sm",
            py: 2,
            display: { xs: "none", sm: "flex" },
            flexWrap: "wrap",
            gap: 1.5,
            bgcolor: "transparent",
          }}
        >
          <FormControl sx={{ flex: 1 }} size="sm">
            <FormLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
              Search staff
            </FormLabel>
            <Input
              size="sm"
              placeholder="Search by name, email or phone"
              startDecorator={<SearchIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: "rgba(30,30,30,0.8)",
                "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
                "& .MuiInput-input::placeholder": { color: "rgba(255,255,255,0.5)" },
              }}
            />
          </FormControl>
          {renderFilters()}
        </Box>

        {/* Apple-style Table Container */}
        <Sheet variant="outlined" sx={{ overflow: "hidden", bgcolor: "rgba(28, 28, 30, 0.95)", backdropFilter: "blur(40px)", border: "1px solid", borderColor: "rgba(84, 84, 88, 0.3)", borderRadius: "20px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)", transition: "all 0.3s ease", "&:hover": { boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)" } }}>
          <Table hoverRow stickyHeader sx={{ display: { xs: "none", md: "table" }, "--TableCell-headBackground": "rgba(28, 28, 30, 0.98)", "--Table-headerUnderlineThickness": "1px", "--TableRow-hoverBackground": "rgba(72, 72, 74, 0.15)", "--TableCell-paddingX": "24px", "--TableCell-paddingY": "20px", "& thead th": { color: "text.secondary", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid", borderColor: "rgba(84, 84, 88, 0.3)", py: 3, backdropFilter: "blur(20px)" }, "& tbody td": { borderColor: "rgba(84, 84, 88, 0.2)", color: "text.primary", fontSize: "15px", py: 3 }, "& tbody tr": { transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { transform: "translateY(-1px)" } } }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Staff Member</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((staffMember: Staff) => (
                <tr key={staffMember.id}>
                  <td>
                    <Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 500, fontFamily: "monospace", fontSize: "14px" }}>#{staffMember.id}</Typography>
                  </td>
                  <td>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar src={staffMember.photo || undefined} sx={{ width: 44, height: 44, bgcolor: "primary.softBg", color: "primary.solidBg", fontSize: "16px", fontWeight: 600, border: "2px solid", borderColor: "rgba(0, 122, 255, 0.2)", transition: "all 0.2s ease", "&:hover": { transform: "scale(1.05)", borderColor: "primary.solidBg" } }}>{!staffMember.photo && staffMember.first_name[0]}</Avatar>
                      <Box>
                        <Typography level="body-md" sx={{ fontWeight: 600, color: "text.primary", fontSize: "15px", letterSpacing: "-0.01em" }}>{staffMember.first_name} {staffMember.last_name}</Typography>
                      </Box>
                    </Stack>
                  </td>
                  <td>
                    <Typography level="body-md" sx={{ color: "text.primary", fontFamily: "monospace", fontSize: "14px" }}>{formatPhoneNumber(staffMember.phone_number)}</Typography>
                  </td>
                  <td>
                    <Typography level="body-md" sx={{ color: "text.primary", fontFamily: "monospace", fontSize: "14px" }}>{staffMember.department}</Typography>
                  </td>
                  <td>
                    <Typography level="body-md" sx={{ fontWeight: 600, color: "success.solidBg", fontSize: "15px" }}>₹{staffMember.salary?.toLocaleString()}</Typography>
                  </td>
                  <td>
                    <Chip variant="soft" color="primary" sx={{ bgcolor: "primary.softBg", color: "primary.solidBg", fontSize: "12px", fontWeight: 500, borderRadius: "8px", textTransform: "capitalize", border: "1px solid", borderColor: "rgba(0, 122, 255, 0.2)", transition: "all 0.2s ease", "&:hover": { bgcolor: "primary.softHoverBg", borderColor: "primary.solidBg" } }}>{staffMember.role?.replace('staff', ' Staff')}</Chip>
                  </td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details" placement="top">
                        <IconButton size="sm" variant="plain" onClick={() => handleViewStaff(staffMember.id)} sx={{ color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "primary.softBg", color: "primary.solidBg", transform: "scale(1.1)" } }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top">
                        <IconButton size="sm" variant="plain" onClick={() => handleEditStaff(staffMember.id)} sx={{ color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "warning.softBg", color: "warning.solidBg", transform: "scale(1.1)" } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Dropdown>
                        <MenuButton slots={{ root: IconButton }} slotProps={{ root: { size: "sm", variant: "plain", sx: { color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "neutral.800", color: "primary.solidBg", transform: "scale(1.1)" } } } }}>
                          <MoreHorizRoundedIcon fontSize="small" />
                        </MenuButton>
                        <Menu>
                          <MenuItem onClick={() => {}}><CurrencyRupeeIcon sx={{ fontSize: 18, mr: 1 }} /> Salary History</MenuItem>
                          <MenuItem onClick={() => handleBlockStaff(staffMember.id)}><BlockIcon sx={{ fontSize: 18, mr: 1 }} /> Block/Unblock</MenuItem>
                        </Menu>
                      </Dropdown>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>

        {/* Mobile Card/List View */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          {filteredStaff.map((staffMember: Staff) => (
            <Card key={staffMember.id} sx={{ my: 1 }}>
              <CardContent>
                <Typography level="body-sm">
                  #{staffMember.id} - {staffMember.first_name} {staffMember.last_name}
                </Typography>
                <Typography level="body-xs">
                  {formatPhoneNumber(staffMember.phone_number)}
                </Typography>
                <Typography level="body-xs">
                  Department: {staffMember.department}
                </Typography>
                <Typography level="body-xs">₹{staffMember.salary}</Typography>
                <Typography level="body-xs">{staffMember.role}</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Tooltip title="View Details">
                    <IconButton
                      size="sm"
                      onClick={() => handleViewStaff(staffMember.id)}
                      sx={{ color: "#fff" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Staff">
                    <IconButton
                      size="sm"
                      onClick={() => handleEditStaff(staffMember.id)}
                      sx={{ color: "#fff" }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Block Staff">
                    <IconButton
                      size="sm"
                      onClick={() => handleBlockStaff(staffMember.id)}
                      sx={{ color: "#fff" }}
                    >
                      <BlockIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            pt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography level="body-sm" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Showing {Math.min(filteredStaff.length, (page + 1) * rowsPerPage)} of {filteredStaff.length} staff members
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              startDecorator={<KeyboardArrowLeftIcon />}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.3)",
                  borderColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Previous
            </Button>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {Array.from({ length: Math.ceil(filteredStaff.length / rowsPerPage) }, (_, i) => (
                <IconButton
                  key={i}
                  size="sm"
                  variant={page === i ? "outlined" : "plain"}
                  color="neutral"
                  onClick={() => setPage(i)}
                  sx={{
                    color: "#fff",
                    borderColor: page === i ? "rgba(255,255,255,0.5)" : "transparent",
                    "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
                  }}
                >
                  {i + 1}
                </IconButton>
              ))}
            </Box>
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              endDecorator={<KeyboardArrowRightIcon />}
              disabled={page >= Math.ceil(filteredStaff.length / rowsPerPage) - 1}
              onClick={() => setPage(page + 1)}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.3)",
                  borderColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}


"use client";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchTrainers, Trainer } from "@/src/features/trainers/trainerSlice";
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
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // NEW – salary history

/* ------------------------------------------------------------------ */
/* 🌒 Dark theme                                                       */
/* ------------------------------------------------------------------ */
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
type SortKey = "id" | "name" | "phone_number" | "salary" | "joined_date";

/* ------------------------------------------------------------------ */
/* 🔧 Sorting helpers                                                  */
/* ------------------------------------------------------------------ */
function descendingComparator(a: Trainer, b: Trainer, orderBy: SortKey) {
  const aVal = a[orderBy] ?? "";
  const bVal = b[orderBy] ?? "";
  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
}
function getComparator(order: Order, orderBy: SortKey) {
  return order === "desc"
    ? (a: Trainer, b: Trainer) => descendingComparator(a, b, orderBy)
    : (a: Trainer, b: Trainer) => -descendingComparator(a, b, orderBy);
}
const formatPhoneNumber = (phone: string) =>
  !phone ? "" : phone.startsWith("+") ? phone : `+${phone}`;

/* ------------------------------------------------------------------ */
/* 🧮 Component                                                        */
/* ------------------------------------------------------------------ */
export default function TrainerTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { trainers } = useSelector((s: RootState) => s.trainers);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortKey>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [blockedFilter, setBlockedFilter] = useState("all");

  /* ─────────────────────────── Fetch trainers ────────────────────────── */
  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch]);

  /* ─────────────────────────── Filter + sort ─────────────────────────── */
  const filteredTrainers = useMemo(() => {
    return trainers
      .filter((t) => {
        const matchedText = `${t.name} ${t.email}`.toLowerCase();
        const searchMatch = matchedText.includes(searchTerm.toLowerCase());
        const blockedMatch =
          blockedFilter === "all" ||
          (blockedFilter === "blocked" && t.is_blocked) ||
          (blockedFilter === "unblocked" && !t.is_blocked);
        return searchMatch && blockedMatch;
      })
      .sort(getComparator(order, orderBy));
  }, [trainers, searchTerm, blockedFilter, order, orderBy]);

  /* ─────────────────────────── Handlers ──────────────────────────────── */
  const handleRequestSort = (property: SortKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleViewTrainer = (id: number) =>
    router.push(`/admin/trainermanagement/view/${id}`);
  const handleEditTrainer = (id: number) =>
    router.push(`/admin/trainermanagement/edit/${id}`);
  const handleSalaryHistory = (id: number) =>
    router.push(`/admin/trainermanagement/salary-history/${id}`);
  const handleBlockTrainer = (id: number) =>
    console.log(`Block/unblock trainer ${id}`);

  /* ─────────────────────────── Render filters ────────────────────────── */
  const renderFilters = () => (
    <FormControl size="sm">
      <FormLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Blocked</FormLabel>
      <Select
        size="sm"
        value={blockedFilter}
        onChange={(e) =>
          e && setBlockedFilter((e.target as HTMLSelectElement).value)
        }
        placeholder="Filter by block status"
        sx={{
          color: "#fff",
          bgcolor: "rgba(30, 30, 30, 0.8)",
          "& .MuiSelect-indicator": { color: "#fff" },
          "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
        }}
      >
        <Option value="all">All</Option>
        <Option value="blocked">Blocked</Option>
        <Option value="unblocked">Unblocked</Option>
      </Select>
    </FormControl>
  );

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <CssVarsProvider theme={appleTheme} defaultMode="dark">
      <Box sx={{ maxWidth: "100%", mx: "auto", p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh", bgcolor: "background.body" }}>
        {/* Header Section */}
        <Box sx={{ mb: 5 }}>
          <Typography level="h2" sx={{ color: "text.primary", mb: 1.5, fontSize: { xs: "28px", sm: "32px", md: "36px" }, fontWeight: 700, letterSpacing: "-0.025em", background: "linear-gradient(135deg, #F2F2F7 0%, rgba(235, 235, 245, 0.8) 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Trainer Directory
          </Typography>
          <Typography level="body-lg" sx={{ color: "text.secondary", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.01em" }}>
            Manage your trainers and their information
          </Typography>
        </Box>
        {/* Mobile Search & Filter */}
        <Sheet sx={{ display: { xs: "flex", sm: "none" }, mb: 4, gap: 2, bgcolor: "transparent", boxShadow: "none" }}>
          <Input
            size="lg"
            placeholder="Search trainers..."
            startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "20px" }} />}
            sx={{ flexGrow: 1, bgcolor: "background.level1", border: "1px solid", borderColor: "neutral.outlinedBorder", borderRadius: "14px", color: "text.primary", fontSize: "16px", py: 2, backdropFilter: "blur(20px)", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { borderColor: "neutral.300", bgcolor: "background.level2", transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }, "&:focus-within": { borderColor: "primary.solidBg", boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.12)", transform: "translateY(-1px)" }, "& .MuiInput-input::placeholder": { color: "text.tertiary", fontSize: "16px" } }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            size="lg"
            variant="outlined"
            startDecorator={<FilterAltIcon />}
            onClick={() => setIsFilterOpen(true)}
            sx={{ borderRadius: "14px", borderColor: "neutral.outlinedBorder", color: "text.primary", bgcolor: "background.level1", backdropFilter: "blur(20px)", minWidth: "52px", px: 2.5, transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { bgcolor: "background.level2", borderColor: "neutral.300", transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" } }}
          >
            Filter
          </Button>
          <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
            <ModalDialog layout="center" sx={{ bgcolor: "rgba(28, 28, 30, 0.95)", backdropFilter: "blur(40px)", borderRadius: "20px", border: "1px solid", borderColor: "rgba(84, 84, 88, 0.3)", p: 4, minWidth: "340px", maxWidth: "420px", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)", animation: "modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "@keyframes modalSlideIn": { "0%": { opacity: 0, transform: "translateY(20px) scale(0.95)" }, "100%": { opacity: 1, transform: "translateY(0) scale(1)" } } }}>
              <ModalClose sx={{ color: "text.secondary", "&:hover": { bgcolor: "rgba(72, 72, 74, 0.3)", color: "text.primary" } }} />
              <Typography level="h3" sx={{ color: "text.primary", mb: 3, fontSize: "22px", fontWeight: 600, letterSpacing: "-0.015em" }}>
                Filter Trainers
              </Typography>
              <Box sx={{ mb: 4 }}>{renderFilters()}</Box>
              <Button fullWidth size="lg" onClick={() => setIsFilterOpen(false)} sx={{ bgcolor: "primary.solidBg", color: "primary.solidColor", borderRadius: "12px", py: 2, fontSize: "16px", fontWeight: 600, transition: "all 0.2s ease", "&:hover": { bgcolor: "primary.solidHoverBg", transform: "translateY(-1px)", boxShadow: "0 6px 16px rgba(0, 122, 255, 0.3)" } }}>
                Apply Filters
              </Button>
            </ModalDialog>
          </Modal>
        </Sheet>
        {/* Desktop Search & Filter */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 4, mb: 5, alignItems: "flex-end" }}>
          <FormControl sx={{ flex: 1, maxWidth: "450px" }}>
            <FormLabel sx={{ color: "text.secondary", fontSize: "14px", fontWeight: 500, mb: 1, textTransform: "none", letterSpacing: "-0.01em" }}>
              Search
            </FormLabel>
            <Input
              size="lg"
              placeholder="Search by name or email"
              startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "20px" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ bgcolor: "background.level1", border: "1px solid", borderColor: "neutral.outlinedBorder", borderRadius: "12px", color: "text.primary", fontSize: "15px", py: 1.8, backdropFilter: "blur(20px)", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { borderColor: "neutral.300", bgcolor: "background.level2", transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }, "&:focus-within": { borderColor: "primary.solidBg", boxShadow: "0 0 0 4px rgba(0, 122, 255, 0.12)", transform: "translateY(-1px)" }, "& .MuiInput-input::placeholder": { color: "text.tertiary", fontSize: "15px" } }}
            />
          </FormControl>
          {renderFilters()}
        </Box>
        {/* Table/Card UI */}
        <Sheet variant="outlined" sx={{ overflow: "hidden", bgcolor: "rgba(28, 28, 30, 0.95)", backdropFilter: "blur(40px)", border: "1px solid", borderColor: "rgba(84, 84, 88, 0.3)", borderRadius: "20px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)", transition: "all 0.3s ease", "&:hover": { boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)" } }}>
          <Table hoverRow stickyHeader sx={{ display: { xs: "none", md: "table" }, "--TableCell-headBackground": "rgba(28, 28, 30, 0.98)", "--Table-headerUnderlineThickness": "1px", "--TableRow-hoverBackground": "rgba(72, 72, 74, 0.15)", "--TableCell-paddingX": "24px", "--TableCell-paddingY": "20px", "& thead th": { color: "text.secondary", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid", borderColor: "rgba(84, 84, 88, 0.3)", py: 3, backdropFilter: "blur(20px)" }, "& tbody td": { borderColor: "rgba(84, 84, 88, 0.2)", color: "text.primary", fontSize: "15px", py: 3 }, "& tbody tr": { transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { transform: "translateY(-1px)" } } }}>
            <thead>
              <tr>
                {[
                  { id: "id", label: "Trainer ID", sortable: true },
                  { id: "name", label: "Trainer Details", sortable: true },
                  { id: "phone_number", label: "Contact", sortable: true },
                  { id: "salary", label: "Salary", sortable: true },
                  { id: "joined_date", label: "Joined Date", sortable: true },
                  { id: "is_blocked", label: "Status", sortable: true },
                  { id: "actions", label: "Actions", sortable: false },
                ].map((head) => (
                  <th key={head.id}>
                    {head.sortable ? (
                      <Button
                        variant="plain"
                        onClick={() => handleRequestSort(head.id as SortKey)}
                        endDecorator={orderBy === head.id ? (
                          <ArrowDropDownIcon sx={{ transform: order === "asc" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                        ) : null}
                        sx={{ color: "text.secondary", bgcolor: "transparent", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", p: 0, minHeight: "auto", transition: "all 0.2s ease", "&:hover": { bgcolor: "rgba(72, 72, 74, 0.2)", color: "text.primary" } }}
                      >
                        {head.label}
                      </Button>
                    ) : (
                      head.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tr) => (
                <tr key={tr.id}>
                  <td>
                    <Typography level="body-md" sx={{ color: "text.secondary", fontWeight: 500, fontFamily: "monospace", fontSize: "14px" }}>#{tr.id}</Typography>
                  </td>
                  <td>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar
                        src={tr.photo || undefined}
                        sx={{ width: 44, height: 44, bgcolor: "primary.softBg", color: "primary.solidBg", fontSize: "16px", fontWeight: 600, border: "2px solid", borderColor: "rgba(0, 122, 255, 0.2)", transition: "all 0.2s ease", "&:hover": { transform: "scale(1.05)", borderColor: "primary.solidBg" } }}
                      >
                        {!tr.photo && tr.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography level="body-md" sx={{ fontWeight: 600, color: "text.primary", fontSize: "15px", letterSpacing: "-0.01em" }}>{tr.name}</Typography>
                        <Typography level="body-sm" sx={{ color: "text.secondary", mt: 0.5, fontSize: "13px" }}>{tr.email}</Typography>
                      </Box>
                    </Stack>
                  </td>
                  <td>
                    <Typography level="body-md" sx={{ color: "text.primary", fontFamily: "monospace", fontSize: "14px" }}>{formatPhoneNumber(tr.phone_number)}</Typography>
                  </td>
                  <td>
                    <Typography level="body-md" sx={{ fontWeight: 600, color: "success.solidBg", fontSize: "15px" }}>₹{tr.salary}</Typography>
                  </td>
                  <td>
                    <Typography level="body-md" sx={{ color: "text.primary", fontSize: "14px" }}>{new Date(tr.joined_date).toLocaleDateString()}</Typography>
                  </td>
                  <td>
                    <Chip variant="soft" sx={{ bgcolor: tr.is_blocked ? "danger.softBg" : "success.softBg", color: tr.is_blocked ? "danger.softColor" : "success.softColor", fontSize: "12px", fontWeight: 500, borderRadius: "8px", textTransform: "capitalize", border: "1px solid", borderColor: tr.is_blocked ? "rgba(255, 59, 48, 0.2)" : "rgba(52, 199, 89, 0.2)", transition: "all 0.2s ease", "&:hover": { bgcolor: tr.is_blocked ? "danger.softBg" : "success.softBg", borderColor: tr.is_blocked ? "danger.solidBg" : "success.solidBg" } }} startDecorator={tr.is_blocked ? <BlockIcon /> : null}>
                      {tr.is_blocked ? "Blocked" : "Active"}
                    </Chip>
                  </td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details" placement="top">
                        <IconButton size="sm" variant="plain" onClick={() => handleViewTrainer(tr.id)} sx={{ color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "primary.softBg", color: "primary.solidBg", transform: "scale(1.1)" } }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Trainer" placement="top">
                        <IconButton size="sm" variant="plain" onClick={() => handleEditTrainer(tr.id)} sx={{ color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "warning.softBg", color: "warning.solidBg", transform: "scale(1.1)" } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Dropdown>
                        <MenuButton slots={{ root: IconButton }} slotProps={{ root: { size: "sm", variant: "plain", sx: { color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "neutral.800", color: "primary.solidBg", transform: "scale(1.1)" } } } }}>
                          <MoreHorizRoundedIcon fontSize="small" />
                        </MenuButton>
                        <Menu>
                          <MenuItem onClick={() => handleSalaryHistory(tr.id)}>
                            <ReceiptLongIcon sx={{ fontSize: 18, mr: 1 }} /> Salary History
                          </MenuItem>
                          <MenuItem onClick={() => handleBlockTrainer(tr.id)}>
                            <BlockIcon sx={{ fontSize: 18, mr: 1 }} /> {tr.is_blocked ? "Unblock Trainer" : "Block Trainer"}
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Card list (mobile) */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {filteredTrainers.map((tr) => (
              <Card key={tr.id} sx={{ my: 1, borderRadius: "16px", bgcolor: "background.level2", boxShadow: "0 2px 8px rgba(0,0,0,0.10)", p: 2.5 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={tr.photo || undefined} sx={{ width: 40, height: 40, bgcolor: "primary.softBg", color: "primary.solidBg", fontWeight: 600, fontSize: "16px", border: "2px solid", borderColor: "rgba(0, 122, 255, 0.2)" }}>{!tr.photo && tr.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography level="body-md" sx={{ fontWeight: 600, color: "text.primary", fontSize: "15px", letterSpacing: "-0.01em" }}>{tr.name}</Typography>
                      <Typography level="body-sm" sx={{ color: "text.secondary", mt: 0.5, fontSize: "13px" }}>{tr.email}</Typography>
                      <Typography level="body-md" sx={{ color: "success.solidBg", fontWeight: 600, fontSize: "15px" }}>₹{tr.salary}</Typography>
                      <Chip size="sm" variant="soft" sx={{ bgcolor: tr.is_blocked ? "danger.softBg" : "success.softBg", color: tr.is_blocked ? "danger.softColor" : "success.softColor", fontSize: "12px", fontWeight: 500, borderRadius: "8px", textTransform: "capitalize", border: "1px solid", borderColor: tr.is_blocked ? "rgba(255, 59, 48, 0.2)" : "rgba(52, 199, 89, 0.2)", mt: 1 }}>{tr.is_blocked ? "Blocked" : "Active"}</Chip>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} mt={2}>
                    <Tooltip title="View Details" placement="top">
                      <IconButton size="sm" variant="plain" onClick={() => handleViewTrainer(tr.id)} sx={{ color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "primary.softBg", color: "primary.solidBg", transform: "scale(1.1)" } }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Trainer" placement="top">
                      <IconButton size="sm" variant="plain" onClick={() => handleEditTrainer(tr.id)} sx={{ color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "warning.softBg", color: "warning.solidBg", transform: "scale(1.1)" } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Salary History" placement="top">
                      <IconButton size="sm" variant="plain" onClick={() => handleSalaryHistory(tr.id)} sx={{ color: "text.secondary", bgcolor: "transparent", borderRadius: "8px", transition: "all 0.2s ease", "&:hover": { bgcolor: "primary.softBg", color: "primary.solidBg", transform: "scale(1.1)" } }}>
                        <ReceiptLongIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Sheet>
        {/* Pagination controls (reuse your previous style or update to match stafflist if needed) */}
        <Box sx={{ pt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
            Showing {Math.min(filteredTrainers.length, (page + 1) * rowsPerPage)} of {filteredTrainers.length} trainers
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="sm" variant="outlined" startDecorator={<KeyboardArrowLeftIcon />} disabled={page === 0} onClick={() => setPage(page - 1)} sx={{ borderRadius: "8px", color: "text.primary", borderColor: "neutral.outlinedBorder", bgcolor: "background.level1", "&:hover": { bgcolor: "background.level2", borderColor: "neutral.300" } }}>
              Previous
            </Button>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {Array.from({ length: Math.ceil(filteredTrainers.length / rowsPerPage) }, (_, i) => (
                <IconButton key={i} size="sm" variant={page === i ? "outlined" : "plain"} onClick={() => setPage(i)} sx={{ borderRadius: "8px", color: page === i ? "primary.solidBg" : "text.secondary", borderColor: page === i ? "primary.solidBg" : "neutral.outlinedBorder", bgcolor: "background.level1", fontWeight: 600, "&:hover": { bgcolor: "background.level2", borderColor: "primary.solidBg", color: "primary.solidBg" } }}>
                  {i + 1}
                </IconButton>
              ))}
            </Box>
            <Button size="sm" variant="outlined" endDecorator={<KeyboardArrowRightIcon />} disabled={page >= Math.ceil(filteredTrainers.length / rowsPerPage) - 1} onClick={() => setPage(page + 1)} sx={{ borderRadius: "8px", color: "text.primary", borderColor: "neutral.outlinedBorder", bgcolor: "background.level1", "&:hover": { bgcolor: "background.level2", borderColor: "neutral.300" } }}>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

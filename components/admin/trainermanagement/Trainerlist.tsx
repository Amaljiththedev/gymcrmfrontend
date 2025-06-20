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
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      {/* ─── Mobile search + filters ────────────────────────────────── */}
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
          placeholder="Search trainers..."
          startDecorator={<SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />}
          sx={{
            flexGrow: 1,
            color: "#fff",
            bgcolor: "rgba(30, 30, 30, 0.8)",
            "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
            "& .MuiInput-input::placeholder": { color: "rgba(255, 255, 255, 0.5)" },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setIsFilterOpen(true)}
          sx={{ color: "#fff", borderColor: "rgba(255, 255, 255, 0.3)" }}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
          <ModalDialog layout="fullscreen" sx={{ bgcolor: "#000", color: "#fff" }}>
            <ModalClose sx={{ color: "#fff" }} />
            <Typography level="h2">Filters</Typography>
            <Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>

      {/* ─── Desktop search + filters ───────────────────────────────── */}
      <Box
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": { minWidth: { xs: "120px", md: "160px" } },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Search trainers
          </FormLabel>
          <Input
            size="sm"
            placeholder="Search by name or email"
            startDecorator={<SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              color: "#fff",
              bgcolor: "rgba(30, 30, 30, 0.8)",
              "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
              "& .MuiInput-input::placeholder": { color: "rgba(255, 255, 255, 0.5)" },
            }}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* ─── Table (desktop) + cards (mobile) ───────────────────────── */}
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
        {/* ───────────────── Table view (md+) ─────────────────────── */}
        <Table
          stickyHeader
          hoverRow
          sx={{
            display: { xs: "none", md: "table" },
            "--TableCell-headBackground": "rgba(25, 25, 25, 0.9)",
            "--TableRow-hoverBackground": "rgba(40, 40, 40, 0.5)",
            "--TableCell-paddingY": "8px",
            "--TableCell-paddingX": "12px",
            color: "#fff",
            "& thead th": { color: "#fff", fontWeight: "bold" },
            "& tbody td": { borderColor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
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
                <th key={head.id} style={{ padding: "12px 6px" }}>
                  {head.sortable ? (
                    <Button
                      component="button"
                      onClick={() => handleRequestSort(head.id as SortKey)}
                      endDecorator={<ArrowDropDownIcon />}
                      sx={{
                        fontWeight: "lg",
                        color: "#fff",
                        bgcolor: "transparent",
                        "& svg": {
                          transition: "0.2s",
                          transform:
                            orderBy === head.id && order === "asc"
                              ? "rotate(180deg)"
                              : "none",
                        },
                      }}
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
            {filteredTrainers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((tr) => (
                <tr key={tr.id}>
                  <td>
                    <Typography level="body-sm">#{tr.id}</Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar
                        size="sm"
                        src={tr.photo || undefined}
                        sx={{
                          bgcolor: tr.photo ? "transparent" : "rgba(60,60,60,0.8)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        {!tr.photo && tr.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography fontWeight="medium">{tr.name}</Typography>
                        <Typography level="body-xs" sx={{ color: "rgba(255,255,255,0.7)" }}>
                          {tr.email}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {formatPhoneNumber(tr.phone_number)}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">₹{tr.salary}</Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {new Date(tr.joined_date).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={tr.is_blocked ? <BlockIcon /> : null}
                      sx={{
                        bgcolor: tr.is_blocked
                          ? "rgba(180,40,40,0.3)"
                          : "rgba(40,120,40,0.3)",
                        color: tr.is_blocked ? "#ffa0a0" : "#a0ffa0",
                      }}
                    >
                      {tr.is_blocked ? "Blocked" : "Active"}
                    </Chip>
                  </td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="sm"
                          onClick={() => handleViewTrainer(tr.id)}
                          sx={{ color: "#fff" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Trainer">
                        <IconButton
                          size="sm"
                          onClick={() => handleEditTrainer(tr.id)}
                          sx={{ color: "#fff" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      {/* Dropdown with more actions */}
                      <Tooltip title="More Actions">
                        <Dropdown>
                          <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{
                              root: {
                                size: "sm",
                                sx: { color: "#fff" },
                                variant: "plain",
                              },
                            }}
                          >
                            <MoreHorizRoundedIcon />
                          </MenuButton>
                          <Menu
                            size="sm"
                            sx={{
                              minWidth: 160,
                              bgcolor: "rgba(30,30,30,0.95)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <MenuItem onClick={() => handleSalaryHistory(tr.id)}>
                              <ReceiptLongIcon fontSize="small" sx={{ mr: 1 }} />
                              Salary history
                            </MenuItem>
                            <MenuItem onClick={() => handleBlockTrainer(tr.id)} color="danger">
                              {tr.is_blocked ? "Unblock Trainer" : "Block Trainer"}
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </Tooltip>
                    </Stack>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        {/* ───────────────── Card list (mobile) ────────────────────── */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          {filteredTrainers.map((tr) => (
            <Card key={tr.id} sx={{ my: 1 }}>
              <CardContent>
                <Typography level="body-sm">
                  #{tr.id} — {tr.name}
                </Typography>
                <Typography level="body-xs">{tr.email}</Typography>
                <Typography level="body-sm">₹{tr.salary}</Typography>
                <Chip size="sm" variant="soft">
                  {tr.is_blocked ? "Blocked" : "Active"}
                </Chip>
                <Stack direction="row" spacing={1} mt={1}>
                  <Tooltip title="View">
                    <IconButton
                      size="sm"
                      onClick={() => handleViewTrainer(tr.id)}
                      sx={{ color: "#fff" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="sm"
                      onClick={() => handleEditTrainer(tr.id)}
                      sx={{ color: "#fff" }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Salary history">
                    <IconButton
                      size="sm"
                      onClick={() => handleSalaryHistory(tr.id)}
                      sx={{ color: "#fff" }}
                    >
                      <ReceiptLongIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Sheet>

      {/* ─── Pagination controls ───────────────────────────────────── */}
      <Box
        sx={{
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="body-sm" sx={{ color: "rgba(255,255,255,0.7)" }}>
          Showing {Math.min(filteredTrainers.length, (page + 1) * rowsPerPage)} of{" "}
          {filteredTrainers.length} trainers
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="sm"
            variant="outlined"
            startDecorator={<KeyboardArrowLeftIcon />}
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {Array.from(
              { length: Math.ceil(filteredTrainers.length / rowsPerPage) },
              (_, i) => (
                <IconButton
                  key={i}
                  size="sm"
                  variant={page === i ? "outlined" : "plain"}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </IconButton>
              )
            )}
          </Box>
          <Button
            size="sm"
            variant="outlined"
            endDecorator={<KeyboardArrowRightIcon />}
            disabled={page >= Math.ceil(filteredTrainers.length / rowsPerPage) - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

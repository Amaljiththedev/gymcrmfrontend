"use client";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import {
  fetchExpenses,
  fetchExpenseMeta,
  exportExpenses, // Import the new export thunk
  Expense,
  Choice,
} from "@/src/features/expense/expenseSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssVarsProvider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Stack,
  Table,
  Tooltip,
  Typography,
  Divider,
  extendTheme,
} from "@mui/joy";
import {
  FilterAlt as FilterAltIcon,
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

// ────── Theme ──────
const darkTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: { body: "#000", level1: "rgba(20,20,20,0.9)" },
        text: { primary: "#fff", secondary: "rgba(255,255,255,0.7)" },
      },
    },
  },
});

// ────── Sort Helpers ──────
type Order = "asc" | "desc";
type SortKey =
  | "id"
  | "title"
  | "amount"
  | "category"
  | "expense_source"
  | "date";
const sortFn = (ord: Order, key: SortKey) =>
  ord === "desc"
    ? (a: Expense, b: Expense) => ((b as any)[key] > (a as any)[key] ? 1 : -1)
    : (a: Expense, b: Expense) => ((a as any)[key] > (b as any)[key] ? 1 : -1);

// ────── Component ──────
export default function ExpenseTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { expenses, loading, categories, sources } = useSelector(
    (s: RootState) => s.expense
  );

  // Initial data & meta fetch
  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchExpenseMeta());
  }, [dispatch]);

  // UI state
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<SortKey>("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [quick, setQuick] = useState<"all" | "this" | "last">("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Set quick month filter into start & end dates
  useEffect(() => {
    if (quick === "all") return;
    const today = new Date();
    const base =
      quick === "this"
        ? new Date(today.getFullYear(), today.getMonth(), 1)
        : new Date(today.getFullYear(), today.getMonth() - 1, 1);
    setStart(base.toISOString().slice(0, 10));
    setEnd(
      new Date(base.getFullYear(), base.getMonth() + 1, 0)
        .toISOString()
        .slice(0, 10)
    );
  }, [quick]);

  // Filter and sort expenses based on the state parameters
  const filtered = useMemo(() => {
    return expenses
      .filter((e) => {
        const txt = `${e.title} ${e.description} ${e.category} ${e.expense_source}`.toLowerCase();
        const dateOK =
          (!start || new Date(e.date) >= new Date(start)) &&
          (!end || new Date(e.date) <= new Date(end));
        const catOK = categoryFilter === "all" || e.category === categoryFilter;
        const srcOK = sourceFilter === "all" || e.expense_source === sourceFilter;
        return txt.includes(search.toLowerCase()) && dateOK && catOK && srcOK;
      })
      .sort(sortFn(order, orderBy));
  }, [expenses, search, start, end, categoryFilter, sourceFilter, order, orderBy]);

  // New export handler that dispatches the export thunk with filter parameters
  const handleExport = () => {
    const params = {
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      source: sourceFilter !== "all" ? sourceFilter : undefined,
      start_date: start || undefined,
      end_date: end || undefined,
      search: search.trim() !== "" ? search.trim() : undefined,
      ordering: order === "asc" ? orderBy : `-${orderBy}`,
    };
    dispatch(exportExpenses(params));
  };

  const clearAll = () => {
    setSearch("");
    setCategoryFilter("all");
    setSourceFilter("all");
    setQuick("all");
    setStart("");
    setEnd("");
  };

  const X = () => (
    <Box component="span" sx={{ ml: 0.5, fontSize: 12, cursor: "pointer" }}>
      ×
    </Box>
  );

  // Reusable Filters Component
  const Filters = () => (
    <>
      <FormControl size="sm">
        <FormLabel>Category</FormLabel>
        <Select
          size="sm"
          value={categoryFilter}
          onChange={(_, v) => setCategoryFilter(v ?? "all")}
        >
          <Option value="all">All</Option>
          {categories.map((c: Choice) => (
            <Option key={c.value} value={c.value}>
              {c.label}
            </Option>
          ))}
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Source</FormLabel>
        <Select
          size="sm"
          value={sourceFilter}
          onChange={(_, v) => setSourceFilter(v ?? "all")}
        >
          <Option value="all">All</Option>
          {sources.map((s: Choice) => (
            <Option key={s.value} value={s.value}>
              {s.label}
            </Option>
          ))}
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Quick month</FormLabel>
        <Select
          size="sm"
          value={quick}
          onChange={(_, v) => setQuick((v ?? "all") as any)}
        >
          <Option value="all">Any</Option>
          <Option value="this">This month</Option>
          <Option value="last">Last month</Option>
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1}>
        <Input
          type="date"
          size="sm"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <Input
          type="date"
          size="sm"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </Stack>
    </>
  );

  // ────── Render ──────
  return (
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      {/* Mobile Filters */}
      <Sheet
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
          bgcolor: "transparent",
        }}
      >
        <Input
          size="sm"
          placeholder="Search expenses…"
          startDecorator={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <IconButton size="sm" variant="outlined" onClick={() => setFilterOpen(true)}>
          <FilterAltIcon />
        </IconButton>
        <Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
          <ModalDialog layout="fullscreen">
            <ModalClose />
            <Typography level="h2">Filters</Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Filters />
              <Button onClick={() => setFilterOpen(false)}>Apply</Button>
            </Stack>
          </ModalDialog>
        </Modal>
      </Sheet>

      {/* Desktop / Tablet Filters */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          mb: 1,
          "& > *": { minWidth: { xs: 120, md: 160 } },
        }}
      >
        <FormControl size="sm" sx={{ flex: 1 }}>
          <FormLabel>Search</FormLabel>
          <Input
            size="sm"
            placeholder="Title, description…"
            startDecorator={<SearchIcon />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormControl>
        <Filters />
        <Button
          size="sm"
          variant="solid"
          color="danger"
          startDecorator={<DownloadIcon />}
          onClick={handleExport}
          sx={{ alignSelf: "end" }}
        >
          Excel
        </Button>
      </Box>

      {/* Active Chips */}
      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
        {categoryFilter !== "all" && (
          <Chip onClick={() => setCategoryFilter("all")} endDecorator={<X />}>
            Category: {categoryFilter}
          </Chip>
        )}
        {sourceFilter !== "all" && (
          <Chip onClick={() => setSourceFilter("all")} endDecorator={<X />}>
            Source: {sourceFilter}
          </Chip>
        )}
        {quick !== "all" && (
          <Chip onClick={() => setQuick("all")} endDecorator={<X />}>
            {quick === "this" ? "This month" : "Last month"}
          </Chip>
        )}
        {(start || end) && (
          <Chip
            onClick={() => {
              setStart("");
              setEnd("");
              setQuick("all");
            }}
            endDecorator={<X />}
          >
            {start || "…"} – {end || "…"}
          </Chip>
        )}
        {search && (
          <Chip onClick={() => setSearch("")} endDecorator={<X />}>
            “{search}”
          </Chip>
        )}
        {(categoryFilter !== "all" ||
          sourceFilter !== "all" ||
          quick !== "all" ||
          start ||
          end ||
          search) && (
          <Button size="sm" variant="plain" onClick={clearAll}>
            Clear All
          </Button>
        )}
      </Stack>

      {/* Table */}
      <Sheet
        variant="outlined"
        sx={{ borderRadius: "sm", overflow: "auto", bgcolor: "rgba(20,20,20,0.6)" }}
      >
        <Table
          stickyHeader
          hoverRow
          sx={{
            display: { xs: "none", md: "table" },
            "--TableCell-headBackground": "rgba(25,25,25,0.9)",
            "& thead th": { color: "#fff", fontWeight: "bold" },
          }}
        >
          <thead>
            <tr>
              {[
                { id: "id", label: "ID" },
                { id: "title", label: "Title" },
                { id: "amount", label: "Amount" },
                { id: "category", label: "Category" },
                { id: "expense_source", label: "Source" },
                { id: "date", label: "Date" },
                { id: "actions", label: "Actions", sortable: false },
              ].map((h) => (
                <th key={h.id}>
                  {h.sortable === false ? (
                    h.label
                  ) : (
                    <Button
                      size="sm"
                      variant="plain"
                      endDecorator={<ArrowDropDownIcon />}
                      onClick={() => {
                        setOrderBy(h.id as SortKey);
                        setOrder(order === "asc" ? "desc" : "asc");
                      }}
                      sx={{
                        color: "#fff",
                        "& svg": {
                          transform:
                            orderBy === h.id && order === "asc"
                              ? "rotate(180deg)"
                              : "none",
                        },
                      }}
                    >
                      {h.label}
                    </Button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                  Loading…
                </td>
              </tr>
            ) : (
              filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e) => (
                  <tr key={e.id}>
                    <td>#{e.id}</td>
                    <td>{e.title}</td>
                    <td>₹{Number(e.amount).toLocaleString()}</td>
                    <td>{e.category}</td>
                    <td>{e.expense_source}</td>
                    <td>{e.date}</td>
                    <td>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View">
                          <IconButton
                            size="sm"
                            variant="plain"
                            onClick={() => router.push(`/admin/expensemanagement/view/${e.id}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="sm"
                            variant="plain"
                            onClick={() => router.push(`/admin/expensemanagement/edit/${e.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="sm" variant="plain" color="danger">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography level="body-sm">
            Showing {Math.min(filtered.length, (page + 1) * rowsPerPage)} of{" "}
            {filtered.length} expenses
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="sm"
              variant="outlined"
              startDecorator={<KeyboardArrowLeftIcon />}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outlined"
              endDecorator={<KeyboardArrowRightIcon />}
              disabled={page >= Math.ceil(filtered.length / rowsPerPage) - 1}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Stack>
        </Box>
      </Sheet>
    </CssVarsProvider>
  );
}

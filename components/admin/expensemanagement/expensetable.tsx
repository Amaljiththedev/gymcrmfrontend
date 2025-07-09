"use client";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import {
  fetchExpenses,
  fetchExpenseMeta,
  exportExpenses,
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
  Avatar,
  Badge,
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
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon,
  DateRange as DateRangeIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// ────── Enhanced Apple Theme ──────
const appleProTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#000000",
          surface: "rgba(28, 28, 30, 0.95)",
          level1: "rgba(44, 44, 46, 0.9)",
          level2: "rgba(58, 58, 60, 0.85)",
          level3: "rgba(72, 72, 74, 0.8)",
        },
        primary: {
          50: "#e6f3ff",
          100: "#b3d9ff",
          200: "#80bfff",
          300: "#4da6ff",
          400: "#1a8cff",
          500: "#007AFF",
          600: "#0056b3",
          700: "#004085",
          800: "#002952",
          900: "#001f3f",
          plainColor: "#007AFF",
          solidBg: "#007AFF",
          solidHoverBg: "#0056CC",
          solidActiveBg: "#004499",
        },
        neutral: {
          50: "#ffffff",
          100: "#f5f5f7",
          200: "#e5e5ea",
          300: "#d1d1d6",
          400: "#c7c7cc",
          500: "#aeaeb2",
          600: "#8e8e93",
          700: "#636366",
          800: "#48484a",
          900: "#1c1c1e",
          plainColor: "rgba(255, 255, 255, 0.9)",
          outlinedBg: "rgba(44, 44, 46, 0.6)",
          outlinedColor: "rgba(255, 255, 255, 0.9)",
          outlinedBorder: "rgba(99, 99, 102, 0.3)",
          plainHoverBg: "rgba(99, 99, 102, 0.12)",
        },
        text: {
          primary: "rgba(255, 255, 255, 0.95)",
          secondary: "rgba(235, 235, 245, 0.65)",
          tertiary: "rgba(235, 235, 245, 0.35)",
        },
        success: {
          solidBg: "#30D158",
          plainColor: "#30D158",
          50: "#e6f9ea",
          500: "#30D158",
        },
        warning: {
          solidBg: "#FF9F0A",
          plainColor: "#FF9F0A",
          50: "#fff5e6",
          500: "#FF9F0A",
        },
        danger: {
          solidBg: "#FF453A",
          plainColor: "#FF453A",
          50: "#ffe6e6",
          500: "#FF453A",
        },
      },
    },
  },
  fontFamily: {
    body: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
    display: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
  },
  fontSize: {
    xs: "0.75rem",   // 12px
    sm: "0.8125rem", // 13px
    md: "0.9375rem", // 15px
    lg: "1.0625rem", // 17px
    xl: "1.25rem",   // 20px
  },
  fontWeight: {
    xs: 300,
    sm: 400,
    md: 500,
    lg: 600,
    xl: 700,
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  shadow: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
    sm: "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)",
    xl: "0 16px 32px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)",
  },
});

// ────── Sort Helpers ──────
type Order = "asc" | "desc";
type SortKey = "id" | "title" | "amount" | "category" | "expense_source" | "date";

const sortFn = (ord: Order, key: SortKey) =>
  ord === "desc"
    ? (a: Expense, b: Expense) => ((b as any)[key] > (a as any)[key] ? 1 : -1)
    : (a: Expense, b: Expense) => ((a as any)[key] > (b as any)[key] ? 1 : -1);

// ────── Utility Functions ──────
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'equipment': 'primary',
    'maintenance': 'warning',
    'utilities': 'success',
    'marketing': 'danger',
    'staff': 'neutral',
    'default': 'neutral'
  };
  return colors[category.toLowerCase()] || colors.default;
};

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
  const [rowsPerPage] = useState(12);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [quick, setQuick] = useState<"all" | "this" | "last">("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Set quick month filter into start & end dates
  useEffect(() => {
    if (quick === "all") {
      setStart("");
      setEnd("");
      return;
    }
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

  // Filter and sort expenses
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

  // Export handler
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

  // Clear all filters
  const clearAll = () => {
    setSearch("");
    setCategoryFilter("all");
    setSourceFilter("all");
    setQuick("all");
    setStart("");
    setEnd("");
    setPage(0);
  };

  // Active filter count
  const activeFilters = [
    categoryFilter !== "all",
    sourceFilter !== "all",
    search.trim() !== "",
    start !== "",
    end !== "",
  ].filter(Boolean).length;

  // Calculate totals
  const totalAmount = filtered.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const monthlyAverage = filtered.length > 0 ? totalAmount / Math.max(1, new Set(filtered.map(e => e.date.slice(0, 7))).size) : 0;

  // Reusable Filters Component
  const Filters = ({ isMobile = false }) => (
    <Stack spacing={isMobile ? 3 : 2} sx={{ width: '100%' }}>
      <FormControl size={isMobile ? "md" : "sm"}>
        <FormLabel sx={{ 
          color: "text.secondary", 
          fontSize: isMobile ? "15px" : "13px",
          fontWeight: 500,
          mb: 1
        }}>
          Category
        </FormLabel>
        <Select
          size={isMobile ? "md" : "sm"}
          value={categoryFilter}
          onChange={(_, v) => setCategoryFilter(v ?? "all")}
          startDecorator={<CategoryIcon sx={{ fontSize: "18px" }} />}
          sx={{
            bgcolor: "rgba(44, 44, 46, 0.6)",
            border: "1px solid rgba(99, 99, 102, 0.3)",
            borderRadius: isMobile ? "12px" : "8px",
            "&:hover": {
              bgcolor: "rgba(44, 44, 46, 0.8)",
              borderColor: "rgba(99, 99, 102, 0.5)"
            }
          }}
        >
          <Option value="all">All Categories</Option>
          {categories.map((c: Choice) => (
            <Option key={c.value} value={c.value}>
              {c.label}
            </Option>
          ))}
        </Select>
      </FormControl>

      <FormControl size={isMobile ? "md" : "sm"}>
        <FormLabel sx={{ 
          color: "text.secondary", 
          fontSize: isMobile ? "15px" : "13px",
          fontWeight: 500,
          mb: 1
        }}>
          Source
        </FormLabel>
        <Select
          size={isMobile ? "md" : "sm"}
          value={sourceFilter}
          onChange={(_, v) => setSourceFilter(v ?? "all")}
          startDecorator={<ReceiptIcon sx={{ fontSize: "18px" }} />}
          sx={{
            bgcolor: "rgba(44, 44, 46, 0.6)",
            border: "1px solid rgba(99, 99, 102, 0.3)",
            borderRadius: isMobile ? "12px" : "8px",
            "&:hover": {
              bgcolor: "rgba(44, 44, 46, 0.8)",
              borderColor: "rgba(99, 99, 102, 0.5)"
            }
          }}
        >
          <Option value="all">All Sources</Option>
          {sources.map((s: Choice) => (
            <Option key={s.value} value={s.value}>
              {s.label}
            </Option>
          ))}
        </Select>
      </FormControl>

      <FormControl size={isMobile ? "md" : "sm"}>
        <FormLabel sx={{ 
          color: "text.secondary", 
          fontSize: isMobile ? "15px" : "13px",
          fontWeight: 500,
          mb: 1
        }}>
          Time Period
        </FormLabel>
        <Select
          size={isMobile ? "md" : "sm"}
          value={quick}
          onChange={(_, v) => setQuick((v ?? "all") as any)}
          startDecorator={<DateRangeIcon sx={{ fontSize: "18px" }} />}
          sx={{
            bgcolor: "rgba(44, 44, 46, 0.6)",
            border: "1px solid rgba(99, 99, 102, 0.3)",
            borderRadius: isMobile ? "12px" : "8px",
            "&:hover": {
              bgcolor: "rgba(44, 44, 46, 0.8)",
              borderColor: "rgba(99, 99, 102, 0.5)"
            }
          }}
        >
          <Option value="all">All Time</Option>
          <Option value="this">This Month</Option>
          <Option value="last">Last Month</Option>
        </Select>
      </FormControl>

      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 1}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel sx={{ 
            color: "text.secondary", 
            fontSize: isMobile ? "15px" : "13px",
            fontWeight: 500,
            mb: 1
          }}>
            From
          </FormLabel>
          <Input
            type="date"
            size={isMobile ? "md" : "sm"}
            value={start}
            onChange={(e) => setStart(e.target.value)}
            sx={{
              bgcolor: "rgba(44, 44, 46, 0.6)",
              border: "1px solid rgba(99, 99, 102, 0.3)",
              borderRadius: isMobile ? "12px" : "8px",
              "&:hover": {
                bgcolor: "rgba(44, 44, 46, 0.8)",
                borderColor: "rgba(99, 99, 102, 0.5)"
              }
            }}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel sx={{ 
            color: "text.secondary", 
            fontSize: isMobile ? "15px" : "13px",
            fontWeight: 500,
            mb: 1
          }}>
            To
          </FormLabel>
          <Input
            type="date"
            size={isMobile ? "md" : "sm"}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            sx={{
              bgcolor: "rgba(44, 44, 46, 0.6)",
              border: "1px solid rgba(99, 99, 102, 0.3)",
              borderRadius: isMobile ? "12px" : "8px",
              "&:hover": {
                bgcolor: "rgba(44, 44, 46, 0.8)",
                borderColor: "rgba(99, 99, 102, 0.5)"
              }
            }}
          />
        </FormControl>
      </Stack>

      {activeFilters > 0 && (
        <Button
          size={isMobile ? "md" : "sm"}
          variant="soft"
          color="neutral"
          startDecorator={<ClearIcon />}
          onClick={clearAll}
          sx={{
            bgcolor: "rgba(99, 99, 102, 0.2)",
            color: "text.secondary",
            borderRadius: isMobile ? "12px" : "8px",
            "&:hover": {
              bgcolor: "rgba(99, 99, 102, 0.3)",
              color: "text.primary"
            }
          }}
        >
          Clear All Filters
        </Button>
      )}
    </Stack>
  );

  // ────── Render ──────
  return (
    <CssVarsProvider theme={appleProTheme} defaultMode="dark">
      <Box sx={{
        minHeight: "100vh",
        bgcolor: "background.body",
        p: { xs: 2, sm: 3, md: 4 },
        fontFamily: "body"
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            level="h1"
            sx={{
              fontSize: { xs: "28px", sm: "32px", md: "40px" },
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
              letterSpacing: "-0.025em",
              fontFamily: "display"
            }}
          >
            Expense Management
          </Typography>
          <Typography
            level="body-lg"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "15px", sm: "17px" },
              fontWeight: 400,
              mb: 3
            }}
          >
            Track and manage your business expenses with detailed insights
          </Typography>

          {/* Summary Cards */}
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Card sx={{
              flex: 1,
              bgcolor: "rgba(44, 44, 46, 0.6)",
              border: "1px solid rgba(99, 99, 102, 0.2)",
              borderRadius: "16px",
              backdropFilter: "blur(20px)",
              p: 2
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: "primary.500", 
                    width: 48, 
                    height: 48 
                  }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography level="body-sm" sx={{ color: "text.secondary", mb: 0.5 }}>
                      Total Expenses
                    </Typography>
                    <Typography level="h3" sx={{ color: "text.primary", fontWeight: 600 }}>
                      {formatCurrency(totalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{
              flex: 1,
              bgcolor: "rgba(44, 44, 46, 0.6)",
              border: "1px solid rgba(99, 99, 102, 0.2)",
              borderRadius: "16px",
              backdropFilter: "blur(20px)",
              p: 2
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: "success.500", 
                    width: 48, 
                    height: 48 
                  }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography level="body-sm" sx={{ color: "text.secondary", mb: 0.5 }}>
                      Total Records
                    </Typography>
                    <Typography level="h3" sx={{ color: "text.primary", fontWeight: 600 }}>
                      {filtered.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{
              flex: 1,
              bgcolor: "rgba(44, 44, 46, 0.6)",
              border: "1px solid rgba(99, 99, 102, 0.2)",
              borderRadius: "16px",
              backdropFilter: "blur(20px)",
              p: 2
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: "warning.500", 
                    width: 48, 
                    height: 48 
                  }}>
                    <DateRangeIcon />
                  </Avatar>
                  <Box>
                    <Typography level="body-sm" sx={{ color: "text.secondary", mb: 0.5 }}>
                      Monthly Avg
                    </Typography>
                    <Typography level="h3" sx={{ color: "text.primary", fontWeight: 600 }}>
                      {formatCurrency(monthlyAverage)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* Search and Filters Section */}
        <Box sx={{ mb: 4 }}>
          {/* Mobile Search Bar */}
          <Box sx={{ display: { xs: "flex", md: "none" }, mb: 3, gap: 2 }}>
            <Input
              size="md"
              placeholder="Search expenses..."
              startDecorator={<SearchIcon sx={{ color: "text.secondary" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
                bgcolor: "rgba(44, 44, 46, 0.6)",
                border: "1px solid rgba(99, 99, 102, 0.3)",
                borderRadius: "12px",
                fontSize: "16px",
                "&:hover": {
                  bgcolor: "rgba(44, 44, 46, 0.8)",
                  borderColor: "rgba(99, 99, 102, 0.5)"
                },
                "&:focus-within": {
                  borderColor: "primary.500",
                  boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)"
                }
              }}
            />
            <IconButton
              size="md"
              variant="outlined"
              onClick={() => setFilterOpen(true)}
              sx={{
                borderRadius: "12px",
                bgcolor: "rgba(44, 44, 46, 0.6)",
                borderColor: "rgba(99, 99, 102, 0.3)",
                "&:hover": {
                  bgcolor: "rgba(44, 44, 46, 0.8)",
                  borderColor: "rgba(99, 99, 102, 0.5)"
                }
              }}
            >
              <Badge badgeContent={activeFilters} color="primary" size="sm">
                <FilterAltIcon />
              </Badge>
            </IconButton>
          </Box>

          {/* Desktop Search and Filters */}
          <Card sx={{
            display: { xs: "none", md: "block" },
            bgcolor: "rgba(44, 44, 46, 0.4)",
            border: "1px solid rgba(99, 99, 102, 0.2)",
            borderRadius: "20px",
            backdropFilter: "blur(20px)",
            p: 3
          }}>
            <Stack spacing={3}>
              {/* Search Row */}
              <Box sx={{ display: "flex", gap: 3, alignItems: "end" }}>
                <FormControl sx={{ flex: 1, maxWidth: "400px" }}>
                  <FormLabel sx={{
                    color: "text.secondary",
                    fontSize: "13px",
                    fontWeight: 500,
                    mb: 1
                  }}>
                    Search Expenses
                  </FormLabel>
                  <Input
                    size="md"
                    placeholder="Search by title, description, category..."
                    startDecorator={<SearchIcon sx={{ color: "text.secondary" }} />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                      bgcolor: "rgba(44, 44, 46, 0.6)",
                      border: "1px solid rgba(99, 99, 102, 0.3)",
                      borderRadius: "12px",
                      fontSize: "15px",
                      "&:hover": {
                        bgcolor: "rgba(44, 44, 46, 0.8)",
                        borderColor: "rgba(99, 99, 102, 0.5)"
                      },
                      "&:focus-within": {
                        borderColor: "primary.500",
                        boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)"
                      }
                    }}
                  />
                </FormControl>
                <Button
                  size="md"
                  variant="solid"
                  color="primary"
                  startDecorator={<DownloadIcon />}
                  onClick={handleExport}
                  sx={{
                    borderRadius: "12px",
                    px: 3,
                    fontWeight: 600
                  }}
                >
                  Export Excel
                </Button>
              </Box>

              {/* Filters Row */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "end" }}>
                <Filters />
              </Box>

              {/* Active Filters Display */}
              {activeFilters > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography level="body-sm" sx={{ color: "text.secondary", mr: 1 }}>
                    Active filters:
                  </Typography>
                  {categoryFilter !== "all" && (
                    <Chip
                      variant="soft"
                      color="primary"
                      size="sm"
                      endDecorator={
                        <CloseIcon 
                          sx={{ fontSize: "14px", cursor: "pointer" }}
                          onClick={() => setCategoryFilter("all")}
                        />
                      }
                    >
                      Category: {categories.find(c => c.value === categoryFilter)?.label}
                    </Chip>
                  )}
                  {sourceFilter !== "all" && (
                    <Chip
                      variant="soft"
                      color="primary"  
                      size="sm"
                      endDecorator={
                        <CloseIcon 
                          sx={{ fontSize: "14px", cursor: "pointer" }}
                          onClick={() => setSourceFilter("all")}
                        />
                      }
                    >
                      Source: {sources.find(s => s.value === sourceFilter)?.label}
                    </Chip>
                  )}
                  {search && (
                    <Chip
                      variant="soft"
                      color="primary"
                      size="sm"
                      endDecorator={
                        <CloseIcon 
                          sx={{ fontSize: "14px", cursor: "pointer" }}
                          onClick={() => setSearch("")}
                        />
                      }
                    >
                      Search: {search}
                    </Chip>
                  )}
                </Box>
              )}
            </Stack>
          </Card>
        </Box>

        {/* Main Table */}
        <Card sx={{
          bgcolor: "rgba(44, 44, 46, 0.4)",
          border: "1px solid rgba(99, 99, 102, 0.2)",
          borderRadius: "20px",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)"
        }}>
          {loading ? (
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              minHeight: "400px" 
            }}>
              <Typography sx={{ color: "text.secondary" }}>Loading expenses...</Typography>
            </Box>
          ) : (
            <>
              {/* Desktop Table */}
              <Table
                stickyHeader
                hoverRow
                sx={{
                  display: { xs: "none", md: "table" },
                  "--TableCell-headBackground": "rgba(58, 58, 60, 0.8)",
                  "--TableCell-paddingY": "20px",
                  "--TableCell-paddingX": "24px",
                  "--TableRow-hoverBackground": "rgba(99, 99, 102, 0.06)",
                  "& thead th": {
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: 15,
                  },
                }}
              >
                {/* Table Head */}
                <thead>
                  <tr>
                    <th onClick={() => { setOrderBy('date'); setOrder(orderBy === 'date' && order === 'desc' ? 'asc' : 'desc'); }} style={{ cursor: 'pointer' }}>Date</th>
                    <th onClick={() => { setOrderBy('title'); setOrder(orderBy === 'title' && order === 'desc' ? 'asc' : 'desc'); }} style={{ cursor: 'pointer' }}>Title</th>
                    <th>Description</th>
                    <th onClick={() => { setOrderBy('category'); setOrder(orderBy === 'category' && order === 'desc' ? 'asc' : 'desc'); }} style={{ cursor: 'pointer' }}>Category</th>
                    <th onClick={() => { setOrderBy('expense_source'); setOrder(orderBy === 'expense_source' && order === 'desc' ? 'asc' : 'desc'); }} style={{ cursor: 'pointer' }}>Source</th>
                    <th onClick={() => { setOrderBy('amount'); setOrder(orderBy === 'amount' && order === 'desc' ? 'asc' : 'desc'); }} style={{ cursor: 'pointer' }}>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense) => (
                    <tr key={expense.id}>
                      <td>{formatDate(expense.date)}</td>
                      <td>{expense.title}</td>
                      <td>{expense.description}</td>
                      <td>
                        <Chip 
                          variant="soft" 
                          size="sm" 
                          color={getCategoryColor(expense.category) as 'primary' | 'success' | 'warning' | 'danger' | 'neutral'}
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 500,
                            fontSize: '12px',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.5,
                            border: 'none',
                          }}
                        >
                          {expense.category}
                        </Chip>
                      </td>
                      <td>{expense.expense_source}</td>
                      <td>{formatCurrency(Number(expense.amount))}</td>
                      <td>
                        <Tooltip title="View">
                          <IconButton size="sm" onClick={() => router.push(`/admin/expensemanagement/view/${expense.id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="sm" onClick={() => router.push(`/admin/expensemanagement/add?id=${expense.id}`)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="sm" color="danger">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* Pagination */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', alignItems: 'center', p: 2 }}>
                <IconButton disabled={page === 0} onClick={() => setPage(page - 1)}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{page + 1} / {Math.ceil(filtered.length / rowsPerPage)}</Typography>
                <IconButton disabled={page >= Math.ceil(filtered.length / rowsPerPage) - 1} onClick={() => setPage(page + 1)}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
              {/* Mobile Table (optional: can be simplified or omitted) */}
              {/* Filter Modal for mobile */}
              <Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
                <ModalDialog>
                  <ModalClose />
                  <Typography level="h4" sx={{ mb: 2 }}>Filters</Typography>
                  <Filters isMobile />
                  <Button onClick={() => setFilterOpen(false)} sx={{ mt: 2 }} fullWidth>Apply</Button>
                </ModalDialog>
              </Modal>
            </>
          )}
        </Card>
      </Box>
    </CssVarsProvider>
  );
}
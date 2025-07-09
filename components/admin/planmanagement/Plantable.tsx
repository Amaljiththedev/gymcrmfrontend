"use client";
import * as React from "react";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import { ColorPaletteProp } from "@mui/joy/styles";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchMembershipPlans } from "@/src/features/membershipPlans/membershipPlanSlice";

// Define the MembershipPlan type (matching your Django model and slice)
export interface MembershipPlan {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  is_blocked: boolean;
}

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

// Sorting types and functions
type Order = "asc" | "desc";
type SortKey = "name" | "duration_days" | "price" | "is_blocked";

function descendingComparator(
  a: MembershipPlan,
  b: MembershipPlan,
  orderBy: SortKey
): number {
  const aValue = a[orderBy];
  const bValue = b[orderBy];
  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: SortKey) {
  return order === "desc"
    ? (a: MembershipPlan, b: MembershipPlan) =>
        descendingComparator(a, b, orderBy)
    : (a: MembershipPlan, b: MembershipPlan) =>
        -descendingComparator(a, b, orderBy);
}

// Mapping for plan status (active vs. blocked)
interface PlanStatusProps {
  label: string;
  color: ColorPaletteProp;
  bgColor: string;
  textColor: string;
  icon: JSX.Element;
}

const planStatusMapping: Record<"true" | "false", PlanStatusProps> = {
  true: {
    label: "Blocked",
    color: "danger",
    bgColor: "rgba(180, 40, 40, 0.3)",
    textColor: "#ffa0a0",
    icon: <BlockIcon />,
  },
  false: {
    label: "Active",
    color: "success",
    bgColor: "rgba(40, 120, 40, 0.3)",
    textColor: "#a0ffa0",
    icon: <VisibilityIcon />,
  },
};

const PlanManagementTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // Assume your slice is mounted under "membershipPlans" in your store
  const { plans } = useSelector((state: RootState) => state.membershipPlans);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<SortKey>("name");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const filteredPlans = useMemo(() => {
    return plans
      .filter((plan: MembershipPlan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(getComparator(order, orderBy));
  }, [plans, searchTerm, order, orderBy]);

  const handleRequestSort = (property: SortKey): void => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewPlan = (id: number): void => {
    const plan = plans.find((p: MembershipPlan) => p.id === id);
    setSelectedPlan(plan || null);
    setViewModalOpen(true);
  };

  const handleBlockPlan = (id: number): void => {
    // Toggle block/unblock functionality here.
    console.log(`Toggle block for plan ${id}`);
  };

  return (
    <CssVarsProvider theme={appleTheme} defaultMode="dark">
      <Box sx={{ minHeight: "100vh", bgcolor: "background.body", p: { xs: 2, sm: 3, md: 4 }, fontFamily: "body" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography level="h1" sx={{ fontSize: { xs: "28px", sm: "32px", md: "36px" }, fontWeight: 700, color: "text.primary", mb: 1, letterSpacing: "-0.025em" }}>
            Membership Plans
          </Typography>
          <Typography level="body-md" sx={{ color: "text.secondary", fontSize: "17px", fontWeight: 400 }}>
            Manage your gym's membership plans, pricing, and status
          </Typography>
        </Box>
        {/* Mobile Search */}
        <Sheet sx={{ display: { xs: "flex", sm: "none" }, mb: 3, gap: 2, bgcolor: "transparent" }}>
          <Input
            size="md"
            placeholder="Search plans..."
            startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "18px" }} />}
            sx={{ flexGrow: 1, bgcolor: "rgba(44, 44, 46, 0.6)", border: "1px solid rgba(99, 99, 102, 0.3)", borderRadius: "12px", color: "text.primary", fontSize: "16px", backdropFilter: "blur(20px)", "&:hover": { bgcolor: "rgba(44, 44, 46, 0.8)", borderColor: "rgba(99, 99, 102, 0.5)" }, "&:focus-within": { borderColor: "primary.500", boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)" }, "& input::placeholder": { color: "text.secondary", opacity: 1 } }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Sheet>
        {/* Desktop Search */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, mb: 4, p: 3, bgcolor: "rgba(44, 44, 46, 0.4)", borderRadius: "16px", border: "1px solid rgba(99, 99, 102, 0.2)", backdropFilter: "blur(20px)" }}>
          <FormControl sx={{ flex: 1, maxWidth: { lg: "400px" } }}>
            <FormLabel sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500, mb: 1, letterSpacing: "-0.08px" }}>Search Plans</FormLabel>
            <Input
              size="md"
              placeholder="Search by plan name..."
              startDecorator={<SearchIcon sx={{ color: "text.secondary", fontSize: "18px" }} />}
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ bgcolor: "rgba(44, 44, 46, 0.6)", border: "1px solid rgba(99, 99, 102, 0.3)", borderRadius: "10px", color: "text.primary", fontSize: "15px", fontWeight: 400, backdropFilter: "blur(20px)", "&:hover": { bgcolor: "rgba(44, 44, 46, 0.8)", borderColor: "rgba(99, 99, 102, 0.5)" }, "&:focus-within": { borderColor: "primary.500", boxShadow: "0 0 0 2px rgba(0, 122, 255, 0.2)" }, "& input::placeholder": { color: "text.secondary", opacity: 1 } }}
            />
          </FormControl>
        </Box>
        {/* Main Table Container */}
        <Sheet variant="outlined" sx={{ borderRadius: "16px", bgcolor: "rgba(44, 44, 46, 0.4)", border: "1px solid rgba(99, 99, 102, 0.2)", backdropFilter: "blur(20px)", overflow: "hidden", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)" }}>
          {/* Desktop Table */}
          <Table stickyHeader hoverRow sx={{ display: { xs: "none", md: "table" }, "--TableCell-headBackground": "rgba(58, 58, 60, 0.6)", "--TableCell-paddingY": "16px", "--TableCell-paddingX": "20px", "--TableRow-hoverBackground": "rgba(99, 99, 102, 0.08)", fontSize: "15px", "& thead th": { color: "text.primary", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid rgba(99, 99, 102, 0.2)" }, "& tbody td": { color: "text.primary", borderBottom: "1px solid rgba(99, 99, 102, 0.1)", fontSize: "15px" }, "& tbody tr:hover td": { color: "text.primary" } }}>
            <thead>
              <tr>
                {[{ id: "name", label: "Plan Name", sortable: true }, { id: "duration_days", label: "Duration (days)", sortable: true }, { id: "price", label: "Price", sortable: true }, { id: "is_blocked", label: "Status", sortable: true }, { id: "actions", label: "Actions", sortable: false }].map((headCell) => (
                  <th key={headCell.id}>
                    {headCell.sortable ? (
                      <Button
                        variant="plain"
                        onClick={() => handleRequestSort(headCell.id as SortKey)}
                        endDecorator={orderBy === headCell.id ? (<ArrowDropDownIcon sx={{ transform: order === "asc" ? "rotate(180deg)" : "none", transition: "transform 0.2s", fontSize: "18px" }} />) : null}
                        sx={{ color: "text.primary", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", bgcolor: "transparent", "&:hover": { bgcolor: "rgba(99, 99, 102, 0.1)" } }}
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
              {filteredPlans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((plan: MembershipPlan) => (
                <tr key={plan.id}>
                  <td>
                    <Typography sx={{ color: "text.primary", fontSize: "15px", fontWeight: 500 }}>{plan.name}</Typography>
                  </td>
                  <td>
                    <Typography sx={{ color: "text.primary", fontSize: "15px", fontWeight: 400 }}>{plan.duration_days}</Typography>
                  </td>
                  <td>
                    <Typography sx={{ color: "text.primary", fontSize: "15px", fontWeight: 600 }}>₹{plan.price}</Typography>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={planStatusMapping[plan.is_blocked.toString() as "true" | "false"].icon}
                      sx={{
                        bgcolor: planStatusMapping[plan.is_blocked.toString() as "true" | "false"].bgColor,
                        color: planStatusMapping[plan.is_blocked.toString() as "true" | "false"].textColor,
                        fontSize: "12px",
                        fontWeight: 500,
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        border: "none"
                      }}
                    >
                      {plan.is_blocked ? "Blocked" : "Active"}
                    </Chip>
                  </td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Plan" placement="top">
                        <IconButton
                          size="sm"
                          variant="plain"
                          onClick={() => handleViewPlan(plan.id)}
                          sx={{ color: "text.secondary", borderRadius: "8px", "&:hover": { bgcolor: "rgba(99, 99, 102, 0.1)", color: "text.primary" } }}
                        >
                          <VisibilityIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={plan.is_blocked ? "Unlock Plan" : "Lock Plan"} placement="top">
                        <IconButton
                          size="sm"
                          variant="plain"
                          onClick={() => handleBlockPlan(plan.id)}
                          sx={{ color: "text.secondary", borderRadius: "8px", "&:hover": { bgcolor: "rgba(99, 99, 102, 0.1)", color: "text.primary" } }}
                        >
                          <BlockIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Mobile List View */}
          <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
            {filteredPlans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((plan: MembershipPlan) => (
              <Card key={plan.id} sx={{ mb: 2, bgcolor: "rgba(58, 58, 60, 0.6)", border: "1px solid rgba(99, 99, 102, 0.2)", borderRadius: "12px", backdropFilter: "blur(20px)", "&:hover": { bgcolor: "rgba(58, 58, 60, 0.8)", borderColor: "rgba(99, 99, 102, 0.3)" } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography sx={{ color: "text.primary", fontSize: "16px", fontWeight: 600, lineHeight: 1.2 }}>{plan.name}</Typography>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={planStatusMapping[plan.is_blocked.toString() as "true" | "false"].icon}
                      sx={{ bgcolor: planStatusMapping[plan.is_blocked.toString() as "true" | "false"].bgColor, color: planStatusMapping[plan.is_blocked.toString() as "true" | "false"].textColor, fontSize: "11px", fontWeight: 500, textTransform: "capitalize", borderRadius: "8px", px: 1.5, py: 0.5, border: "none" }}
                    >
                      {plan.is_blocked ? "Blocked" : "Active"}
                    </Chip>
                  </Box>
                  <Typography sx={{ color: "text.secondary", fontSize: "14px", fontWeight: 400, mb: 0.5 }}>Duration: {plan.duration_days} days</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "14px", fontWeight: 400, mb: 1 }}>Price: ₹{plan.price}</Typography>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                    <IconButton
                      size="sm"
                      variant="soft"
                      onClick={() => handleViewPlan(plan.id)}
                      sx={{ bgcolor: "rgba(0, 122, 255, 0.15)", color: "primary.500", borderRadius: "8px", "&:hover": { bgcolor: "rgba(0, 122, 255, 0.25)" } }}
                    >
                      <VisibilityIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="soft"
                      onClick={() => handleBlockPlan(plan.id)}
                      sx={{ bgcolor: "rgba(99, 99, 102, 0.15)", color: "text.secondary", borderRadius: "8px", "&:hover": { bgcolor: "rgba(99, 99, 102, 0.25)", color: "text.primary" } }}
                    >
                      <BlockIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Sheet>
        {/* Pagination */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ color: "text.secondary", fontSize: "14px", fontWeight: 400 }}>
            Showing {Math.min(filteredPlans.length, (page + 1) * rowsPerPage)} of {filteredPlans.length} plans
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              size="sm"
              variant="soft"
              startDecorator={<KeyboardArrowLeftIcon />}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              sx={{ bgcolor: "rgba(44, 44, 46, 0.6)", color: "text.primary", border: "1px solid rgba(99, 99, 102, 0.3)", borderRadius: "8px", fontSize: "14px", fontWeight: 500, "&:hover": { bgcolor: "rgba(44, 44, 46, 0.8)", borderColor: "rgba(99, 99, 102, 0.5)" }, "&.Mui-disabled": { color: "text.tertiary", bgcolor: "rgba(44, 44, 46, 0.3)", borderColor: "rgba(99, 99, 102, 0.1)" } }}
            >
              Previous
            </Button>
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 0.5, mx: 1 }}>
              {Array.from({ length: Math.ceil(filteredPlans.length / rowsPerPage) }, (_, i) => (
                <IconButton
                  key={i}
                  size="sm"
                  variant={page === i ? "soft" : "plain"}
                  onClick={() => setPage(i)}
                  sx={{ minWidth: 32, height: 32, borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: page === i ? "primary.500" : "text.secondary", bgcolor: page === i ? "rgba(0, 122, 255, 0.15)" : "transparent", "&:hover": { bgcolor: page === i ? "rgba(0, 122, 255, 0.25)" : "rgba(99, 99, 102, 0.1)", color: page === i ? "primary.500" : "text.primary" } }}
                >
                  {i + 1}
                </IconButton>
              ))}
            </Box>
            <Button
              size="sm"
              variant="soft"
              endDecorator={<KeyboardArrowRightIcon />}
              disabled={page >= Math.ceil(filteredPlans.length / rowsPerPage) - 1}
              onClick={() => setPage(page + 1)}
              sx={{ bgcolor: "rgba(44, 44, 46, 0.6)", color: "text.primary", border: "1px solid rgba(99, 99, 102, 0.3)", borderRadius: "8px", fontSize: "14px", fontWeight: 500, "&:hover": { bgcolor: "rgba(44, 44, 46, 0.8)", borderColor: "rgba(99, 99, 102, 0.5)" }, "&.Mui-disabled": { color: "text.tertiary", bgcolor: "rgba(44, 44, 46, 0.3)", borderColor: "rgba(99, 99, 102, 0.1)" } }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
      {/* View Plan Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <ModalDialog sx={{ bgcolor: "background.body", color: "text.primary", borderRadius: "16px", minWidth: 340, maxWidth: 400, p: 0 }}>
          <Box sx={{ p: 3, borderBottom: "1px solid rgba(99, 99, 102, 0.2)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography level="h4" sx={{ color: "text.primary", fontSize: "22px", fontWeight: 700 }}>
                Plan Details
              </Typography>
              <ModalClose sx={{ color: "text.secondary", position: "static", "&:hover": { color: "text.primary" } }} />
            </Box>
          </Box>
          {selectedPlan && (
            <Box sx={{ p: 3 }}>
              <Typography sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500, mb: 0.5 }}>Plan Name</Typography>
              <Typography sx={{ color: "text.primary", fontSize: "18px", fontWeight: 600, mb: 2 }}>{selectedPlan.name}</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500, mb: 0.5 }}>Duration</Typography>
              <Typography sx={{ color: "text.primary", fontSize: "16px", fontWeight: 500, mb: 2 }}>{selectedPlan.duration_days} days</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500, mb: 0.5 }}>Price</Typography>
              <Typography sx={{ color: "text.primary", fontSize: "16px", fontWeight: 500, mb: 2 }}>₹{selectedPlan.price}</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500, mb: 0.5 }}>Status</Typography>
              <Chip
                variant="soft"
                size="sm"
                startDecorator={planStatusMapping[selectedPlan.is_blocked.toString() as "true" | "false"].icon}
                sx={{ bgcolor: planStatusMapping[selectedPlan.is_blocked.toString() as "true" | "false"].bgColor, color: planStatusMapping[selectedPlan.is_blocked.toString() as "true" | "false"].textColor, fontSize: "13px", fontWeight: 500, textTransform: "capitalize", borderRadius: "8px", px: 1.5, py: 0.5, border: "none", mb: 2 }}
              >
                {selectedPlan.is_blocked ? "Blocked" : "Active"}
              </Chip>
            </Box>
          )}
        </ModalDialog>
      </Modal>
    </CssVarsProvider>
  );
};

export default PlanManagementTable;

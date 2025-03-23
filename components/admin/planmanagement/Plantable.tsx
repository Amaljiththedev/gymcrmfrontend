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

// Create a dark theme
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
    router.push(`/admin/planmanagement/view/${id}`);
  };

  const handleBlockPlan = (id: number): void => {
    // Toggle block/unblock functionality here.
    console.log(`Toggle block for plan ${id}`);
  };

  return (
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      {/* Mobile Search & Filters */}
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
          placeholder="Search plans..."
          startDecorator={
            <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
          }
          sx={{ flexGrow: 1 }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setIsFilterOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
          <ModalDialog sx={{ bgcolor: "#000", color: "#fff" }}>
            <ModalClose />
            <Typography level="h2">Filters</Typography>
            <Divider />
            <Button onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </ModalDialog>
        </Modal>
      </Sheet>

      {/* Tablet & Desktop Search */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          gap: 1.5,
          bgcolor: "transparent",
        }}
      >
        <Input
          size="sm"
          placeholder="Search plans..."
          startDecorator={
            <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
          }
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1 }}
        />
      </Box>

      {/* Main Content */}
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
        {/* Table for Desktop & Tablet */}
        <Table
          stickyHeader
          hoverRow
          sx={{
            display: { xs: "none", md: "table" },
            "--TableCell-headBackground": "rgba(25, 25, 25, 0.9)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "rgba(40, 40, 40, 0.5)",
            "--TableCell-paddingY": "8px",
            "--TableCell-paddingX": "12px",
            color: "#fff",
            "& thead th": { color: "#fff", fontWeight: "bold" },
            "& tbody td": {
              color: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            },
            "& tbody tr:hover td": { color: "#fff" },
          }}
        >
          <thead>
            <tr>
              {[
                { id: "name", label: "Plan Name", sortable: true },
                { id: "duration_days", label: "Duration (days)", sortable: true },
                { id: "price", label: "Price", sortable: true },
                { id: "is_blocked", label: "Status", sortable: true },
                { id: "actions", label: "Actions", sortable: false },
              ].map((headCell) => (
                <th key={headCell.id} style={{ padding: "12px 6px" }}>
                  {headCell.sortable ? (
                    <Button
                      component="button"
                      onClick={() => handleRequestSort(headCell.id as SortKey)}
                      endDecorator={<ArrowDropDownIcon />}
                      sx={{
                        fontWeight: "lg",
                        color: "#fff",
                        bgcolor: "transparent",
                        "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
                        "& svg": {
                          transition: "0.2s",
                          transform:
                            orderBy === headCell.id && order === "asc"
                              ? "rotate(180deg)"
                              : "none",
                        },
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
            {filteredPlans
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((plan: MembershipPlan) => (
                <tr key={plan.id}>
                  <td>
                    <Typography
                      level="body-sm"
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    >
                      {plan.name}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      level="body-sm"
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    >
                      {plan.duration_days}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      level="body-sm"
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    >
                      ₹{plan.price}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        planStatusMapping[
                          plan.is_blocked.toString() as "true" | "false"
                        ].icon
                      }
                      color={
                        planStatusMapping[
                          plan.is_blocked.toString() as "true" | "false"
                        ].color as ColorPaletteProp
                      }
                      sx={{
                        bgcolor:
                          planStatusMapping[
                            plan.is_blocked.toString() as "true" | "false"
                          ].bgColor,
                        color:
                          planStatusMapping[
                            plan.is_blocked.toString() as "true" | "false"
                          ].textColor,
                      }}
                    >
                      {plan.is_blocked ? "Blocked" : "Active"}
                    </Chip>
                  </td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Plan">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleViewPlan(plan.id)}
                          sx={{ color: "#fff" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={plan.is_blocked ? "Unlock Plan" : "Lock Plan"}>
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleBlockPlan(plan.id)}
                          sx={{ color: "#fff" }}
                        >
                          <BlockIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        {/* Mobile List View */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          {filteredPlans.map((plan: MembershipPlan) => (
            <Card key={plan.id} sx={{ my: 1 }}>
              <CardContent>
                <Typography level="body-sm">{plan.name}</Typography>
                <Typography level="body-xs">
                  Duration: {plan.duration_days} days
                </Typography>
                <Typography level="body-xs">Price: ₹{plan.price}</Typography>
                <Chip
                  size="sm"
                  variant="soft"
                  startDecorator={
                    planStatusMapping[
                      plan.is_blocked.toString() as "true" | "false"
                    ].icon
                  }
                  color={
                    planStatusMapping[
                      plan.is_blocked.toString() as "true" | "false"
                    ].color as ColorPaletteProp
                  }
                  sx={{
                    bgcolor:
                      planStatusMapping[
                        plan.is_blocked.toString() as "true" | "false"
                      ].bgColor,
                    color:
                      planStatusMapping[
                        plan.is_blocked.toString() as "true" | "false"
                      ].textColor,
                  }}
                >
                  {plan.is_blocked ? "Blocked" : "Active"}
                </Chip>
                <Stack direction="row" spacing={1} mt={1}>
                  <Tooltip title="View Plan">
                    <IconButton
                      size="sm"
                      onClick={() => handleViewPlan(plan.id)}
                      sx={{ color: "#fff" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={plan.is_blocked ? "Unlock Plan" : "Lock Plan"}>
                    <IconButton
                      size="sm"
                      onClick={() => handleBlockPlan(plan.id)}
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
      </Sheet>

      {/* Pagination */}
      <Box
        sx={{
          pt: 2,
          gap: 1,
          "& .MuiIconButton-root": { borderRadius: "50%" },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          level="body-sm"
          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          Showing {Math.min(filteredPlans.length, (page + 1) * rowsPerPage)} of{" "}
          {filteredPlans.length} plans
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
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
              "&.Mui-disabled": {
                color: "rgba(255, 255, 255, 0.3)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Previous
          </Button>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {Array.from(
              { length: Math.ceil(filteredPlans.length / rowsPerPage) },
              (_, i) => (
                <IconButton
                  key={i}
                  size="sm"
                  variant={page === i ? "outlined" : "plain"}
                  color="neutral"
                  onClick={() => setPage(i)}
                  sx={{
                    color: "#fff",
                    borderColor:
                      page === i ? "rgba(255, 255, 255, 0.5)" : "transparent",
                    "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
                  }}
                >
                  {i + 1}
                </IconButton>
              )
            )}
          </Box>
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            endDecorator={<KeyboardArrowRightIcon />}
            disabled={
              page >= Math.ceil(filteredPlans.length / rowsPerPage) - 1
            }
            onClick={() => setPage(page + 1)}
            sx={{
              color: "#fff",
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
              "&.Mui-disabled": {
                color: "rgba(255, 255, 255, 0.3)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default PlanManagementTable;

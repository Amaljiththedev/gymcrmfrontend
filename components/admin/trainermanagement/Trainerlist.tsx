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

// Create a dark theme (adjust as needed)
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

// Utility function to compare two trainers for sorting
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

// Simple formatter for phone numbers (adjust if needed)
const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  return phone.startsWith("+") ? phone : `+${phone}`;
};

export default function TrainerTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { trainers } = useSelector((state: RootState) => state.trainers);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortKey>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Additional filter for blocked status: all | blocked | unblocked
  const [blockedFilter, setBlockedFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch]);

  // Filter and sort trainers based on search term and blocked filter
  const filteredTrainers = useMemo(() => {
    return trainers
      .filter((trainer: { name: any; email: any; is_blocked: any; }) => {
        const nameEmail = `${trainer.name} ${trainer.email}`.toLowerCase();
        const searchMatch = nameEmail.includes(searchTerm.toLowerCase());
        const blockedMatch =
          blockedFilter === "all" ||
          (blockedFilter === "blocked" && trainer.is_blocked) ||
          (blockedFilter === "unblocked" && !trainer.is_blocked);
        return searchMatch && blockedMatch;
      })
      .sort(getComparator(order, orderBy));
  }, [trainers, searchTerm, blockedFilter, order, orderBy]);

  const handleRequestSort = (property: SortKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewTrainer = (id: number) => {
    router.push(`/admin/trainermanagement/view/${id}`);
  };

  const handleEditTrainer = (id: number) => {
    router.push(`/admin/trainermanagement/edit/${id}`);
  };

  const handleBlockTrainer = (id: number) => {
    // Implement block functionality (e.g., dispatch an update trainer action)
    console.log(`Block trainer ${id}`);
  };

  // Render filter controls
  const renderFilters = () => (
    <>
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
    </>
  );

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
          <ModalDialog
            aria-labelledby="filter-modal"
            layout="fullscreen"
            sx={{ bgcolor: "#000", color: "#fff" }}
          >
            <ModalClose sx={{ color: "#fff" }} />
            <Typography id="filter-modal" level="h2" sx={{ color: "#fff" }}>
              Filters
            </Typography>
            <Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
            <Sheet
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                bgcolor: "transparent",
                boxShadow: "none",
              }}
            >
              {renderFilters()}
              <Button
                color="primary"
                onClick={() => setIsFilterOpen(false)}
                sx={{ bgcolor: "rgba(70, 130, 180, 0.8)", color: "#fff" }}
              >
                Apply Filters
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>

      {/* Tablet & Desktop Search & Filters */}
      <Box
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": { minWidth: { xs: "120px", md: "160px" } },
          bgcolor: "transparent",
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Search trainers</FormLabel>
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

      {/* Main Content: Responsive Table for Desktop & List for Mobile */}
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
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
                { id: "id", label: "Trainer ID", sortable: true },
                { id: "name", label: "Trainer Details", sortable: true },
                { id: "phone_number", label: "Contact", sortable: true },
                { id: "salary", label: "Salary", sortable: true },
                { id: "joined_date", label: "Joined Date", sortable: true },
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
            {filteredTrainers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((trainer) => (
                <tr key={trainer.id}>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      #{trainer.id}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar
                        size="sm"
                        src={trainer.photo || undefined}
                        sx={{
                          bgcolor: trainer.photo ? "transparent" : "rgba(60, 60, 60, 0.8)",
                          color: "#fff",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        {!trainer.photo && trainer.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography
                          level="body-sm"
                          fontWeight="medium"
                          sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                        >
                          {trainer.name}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                          {trainer.email}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      {formatPhoneNumber(trainer.phone_number || "")}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      ₹{trainer.salary}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      {new Date(trainer.joined_date).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={trainer.is_blocked ? <BlockIcon /> : null}
                      sx={{
                        bgcolor: trainer.is_blocked ? "rgba(180, 40, 40, 0.3)" : "rgba(40, 120, 40, 0.3)",
                        color: trainer.is_blocked ? "#ffa0a0" : "#a0ffa0",
                      }}
                    >
                      {trainer.is_blocked ? "Blocked" : "Active"}
                    </Chip>
                  </td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => trainer.id && typeof trainer.id === "number" && handleViewTrainer(trainer.id)}
                          sx={{ color: "#fff" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Trainer">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleEditTrainer(trainer.id)}
                          sx={{ color: "#fff" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More Actions">
                        <Dropdown>
                          <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{
                              root: {
                                variant: "plain",
                                color: "neutral",
                                size: "sm",
                                sx: { color: "#fff" },
                              },
                            }}
                          >
                            <MoreHorizRoundedIcon />
                          </MenuButton>
                          <Menu
                            size="sm"
                            sx={{
                              minWidth: 140,
                              bgcolor: "rgba(30, 30, 30, 0.95)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              "& .MuiMenuItem-root": {
                                color: "#fff",
                                "&:hover": { bgcolor: "rgba(60, 60, 60, 0.7)" },
                              },
                            }}
                          >
                            <MenuItem onClick={() => handleBlockTrainer(trainer.id)} color="danger">
                              {trainer.is_blocked ? "Unblock Trainer" : "Block Trainer"}
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

        {/* Mobile List View */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          {filteredTrainers.map((trainer: { id: boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; email: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; salary: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; is_blocked: any; }) => (
            <Card key={String(trainer.id)} sx={{ my: 1 }}>
              <CardContent>
                <Typography level="body-sm">
                  #{trainer.id} - {trainer.name}
                </Typography>
                <Typography level="body-xs">{trainer.email}</Typography>
                <Typography level="body-sm">₹{trainer.salary}</Typography>
                <Chip size="sm" variant="soft">
                  {trainer.is_blocked ? "Blocked" : "Active"}
                </Chip>
                <Stack direction="row" spacing={1} mt={1}>
                  <Tooltip title="View">
                    <IconButton
                      size="sm"
                      onClick={() => typeof trainer.id === "number" && handleViewTrainer(trainer.id)}
                      sx={{ color: "#fff" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="sm"
                      onClick={() =>  typeof trainer.id === "number" && handleEditTrainer(trainer.id)}
                      sx={{ color: "#fff" }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Sheet>

      {/* Pagination Controls */}
      <Box
        sx={{
          pt: 2,
          gap: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="body-sm" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Showing {Math.min(filteredTrainers.length, (page + 1) * rowsPerPage)} of {filteredTrainers.length} trainers
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
            {Array.from({ length: Math.ceil(filteredTrainers.length / rowsPerPage) }, (_, i) => (
              <IconButton
                key={i}
                size="sm"
                variant={page === i ? "outlined" : "plain"}
                color="neutral"
                onClick={() => setPage(i)}
                sx={{
                  color: "#fff",
                  borderColor: page === i ? "rgba(255, 255, 255, 0.5)" : "transparent",
                  "&:hover": { bgcolor: "rgba(40, 40, 40, 0.8)" },
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
            disabled={page >= Math.ceil(filteredTrainers.length / rowsPerPage) - 1}
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
}

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchSuperstaff, Staff } from "@/src/features/staff/staffSlice";
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
} from "@mui/joy";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";

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

type Order = "asc" | "desc";
type SortKey = "id" | "first_name" | "phone_number" | "salary" | "department" | "role";

// Comparator functions for sorting staff data
function descendingComparator(a: Staff, b: Staff, orderBy: SortKey) {
  if ((b[orderBy as keyof Staff] ?? 0) < (a[orderBy as keyof Staff] ?? 0)) return -1;
  if ((b[orderBy as keyof Staff] ?? 0) > (a[orderBy as keyof Staff] ?? 0)) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: SortKey) {
  return order === "desc"
    ? (a: Staff, b: Staff) => descendingComparator(a, b, orderBy)
    : (a: Staff, b: Staff) => -descendingComparator(a, b, orderBy);
}

// Format phone number to include +91 prefix if not already present
const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  return phone.startsWith("+91") ? phone : `+91 ${phone}`;
};

// Define table header cells
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
  // Use the superStaff state instead of 'all'
  const { superStaff: staff, loading, error } = useSelector((state: RootState) => state.staff);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<SortKey>("first_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Dispatch the fetchSuperstaff thunk when component mounts
  useEffect(() => {
    dispatch(fetchSuperstaff());
  }, [dispatch]);

  // Filter staff based on search term, department, and role
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

  const handleRequestSort = (property: SortKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewStaff = (id: number) => {
    router.push(`/admin/staff/view/${id}`);
  };

  const handleEditStaff = (id: number) => {
    router.push(`/admin/staff/edit/${id}`);
  };

  const handleBlockStaff = (id: number) => {
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
          onChange={(e) =>
            setDepartmentFilter((e?.target as HTMLSelectElement)?.value ?? "all")
          }
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
          onChange={(e) =>
            setRoleFilter((e?.target as HTMLSelectElement)?.value ?? "all")
          }
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

  // Render loading or error states if needed
  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#fff" }}>
        <Typography>Loading Super Staff...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#fff" }}>
        {/* If error is an object, stringify it */}
        <Typography>Error: {typeof error === "object" ? JSON.stringify(error) : error}</Typography>
      </Box>
    );
  }

  return (
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      {/* Mobile Search and Filters */}
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
            color: "#fff",
            bgcolor: "rgba(30,30,30,0.8)",
            "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
            "& .MuiInput-input::placeholder": { color: "rgba(255,255,255,0.5)" },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target.value ?? "")}
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
            <Sheet sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 2,
              bgcolor: "transparent",
              boxShadow: "none",
            }}>
              {renderFilters()}
              <Button 
                color="primary" 
                onClick={() => setIsFilterOpen(false)}
                sx={{ bgcolor: "rgba(70,130,180,0.8)", color: "#fff" }}
              >
                Apply Filters
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>

      {/* Desktop Search and Filters */}
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
          <FormLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Search staff</FormLabel>
          <Input
            size="sm"
            placeholder="Search by name, email or phone"
            startDecorator={<SearchIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target.value ?? "")}
            sx={{ 
              color: "#fff",
              bgcolor: "rgba(30,30,30,0.8)",
              "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
              "& .MuiInput-input::placeholder": { color: "rgba(255,255,255,0.5)" },
            }}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* Staff Table */}
      <Sheet 
        variant="outlined" 
        sx={{ 
          width: "100%", 
          borderRadius: "sm", 
          flexShrink: 1, 
          overflow: "auto",
          bgcolor: "rgba(20,20,20,0.6)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <Table
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": "rgba(25,25,25,0.9)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "rgba(40,40,40,0.5)",
            "--TableCell-paddingY": "8px",
            "--TableCell-paddingX": "12px",
            color: "#fff",
            "& thead th": { color: "#fff", fontWeight: "bold" },
            "& tbody td": { color: "rgba(255,255,255,0.9)", borderColor: "rgba(255,255,255,0.1)" },
            "& tbody tr:hover td": { color: "#fff" },
          }}
        >
          <thead>
            <tr>
              {headCells.map((headCell) => (
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
                        "&:hover": { bgcolor: "rgba(40,40,40,0.8)" },
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
            {filteredStaff
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((staffMember) => (
                <tr key={staffMember.id}>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255,255,255,0.9)" }}>
                      #{staffMember.id}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar
                        size="sm"
                        sx={{ 
                          bgcolor: "rgba(60,60,60,0.8)", 
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        {staffMember.first_name[0]}
                      </Avatar>
                      <div>
                        <Typography level="body-sm" fontWeight="medium" sx={{ color: "rgba(255,255,255,0.9)" }}>
                          {staffMember.first_name} {staffMember.last_name}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "rgba(255,255,255,0.7)" }}>
                          {staffMember.email}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255,255,255,0.9)" }}>
                      {formatPhoneNumber(staffMember.phone_number)}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255,255,255,0.9)" }}>
                      {staffMember.department}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255,255,255,0.9)" }}>
                      ₹{staffMember.salary}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm" sx={{ color: "rgba(255,255,255,0.9)" }}>
                      {staffMember.role}
                    </Typography>
                  </td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleViewStaff(staffMember.id)}
                          sx={{ color: "#fff" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Staff">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleEditStaff(staffMember.id)}
                          sx={{ color: "#fff" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Block Staff">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleBlockStaff(staffMember.id)}
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
      </Sheet>

      <Box
        sx={{
          pt: 2,
          gap: 1,
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
                borderColor: "rgba(255,255,255,0.1)" 
              }
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
                borderColor: "rgba(255,255,255,0.1)" 
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

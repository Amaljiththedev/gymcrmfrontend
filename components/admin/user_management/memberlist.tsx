"use client";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchMembers } from "@/src/features/members/memberSlice";
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
  Checkbox,
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
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Member } from "@/src/features/members/memberSlice";
import { ColorPaletteProp } from "@mui/joy/styles";

// Create a dark theme
const darkTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: '#000',
          surface: 'rgba(0, 0, 0, 0.8)',
          level1: 'rgba(20, 20, 20, 0.9)',
          level2: 'rgba(35, 35, 35, 0.8)',
        },
        primary: {
          softColor: '#fff',
          softBg: 'rgba(60, 60, 60, 0.5)',
        },
        neutral: {
          outlinedBg: 'rgba(45, 45, 45, 0.6)',
          outlinedColor: '#fff',
          plainColor: '#fff',
          plainHoverBg: 'rgba(60, 60, 60, 0.5)',
        },
        text: {
          primary: '#fff',
          secondary: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  },
});

type Order = "asc" | "desc";
type SortKey = "id" | "first_name" | "phone" | "amount_paid" | "membership_status";

function descendingComparator(a: Member, b: Member, orderBy: SortKey) {
  if ((b[orderBy as keyof Member] ?? 0) < (a[orderBy as keyof Member] ?? 0)) return -1;
  if ((b[orderBy as keyof Member] ?? 0) > (a[orderBy as keyof Member] ?? 0)) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: SortKey) {
  return order === "desc"
    ? (a: Member, b: Member) => descendingComparator(a, b, orderBy)
    : (a: Member, b: Member) => -descendingComparator(a, b, orderBy);
}

// Format phone number to include +91 prefix if not already present
const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  return phone.startsWith("+91") ? phone : `+91 ${phone}`;
};

const headCells = [
  { id: "id", label: "Member ID", sortable: true },
  { id: "first_name", label: "Member Details", sortable: true },
  { id: "phone", label: "Contact", sortable: true },
  { id: "amount_paid", label: "Payment", sortable: true },
  { id: "membership_status", label: "Status", sortable: true },
  { id: "actions", label: "Actions", sortable: false },
];

export default function MemberTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { members } = useSelector((state: RootState) => state.members);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<SortKey>("first_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        // Combine first and last name for search matching
        const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
        const searchFields = [fullName, member.email, member.phone].join(" ").toLowerCase();
        const statusMatch = statusFilter === "all" || member.membership_status === statusFilter;
        // Determine if the member is fully paid based on the plan's price
        const fullyPaid = Number(member.amount_paid) >= Number(member.membership_plan.price);
        const amountMatch =
          amountFilter === "all" ||
          (amountFilter === "paid" && fullyPaid) ||
          (amountFilter === "unpaid" && !fullyPaid);
        const planMatch = planFilter === "all" || member.membership_plan.name === planFilter;
        return searchFields.includes(searchTerm.toLowerCase()) && statusMatch && amountMatch && planMatch;
      })
      .sort(getComparator(order, orderBy));
  }, [members, searchTerm, statusFilter, amountFilter, planFilter, order, orderBy]);

  const handleRequestSort = (property: SortKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewMember = (id: number) => {
    router.push(`/admin/membermanagement/view/${id}`);
  };

  const handleEditMember = (id: number) => {
    router.push(`/admin/membermanagement/edit/${id}`);
  };

  const handleBlockMember = (id: number) => {
    // Implement block functionality
    console.log(`Block member ${id}`);
  };

  const renderFilters = () => (
    <>
      <FormControl size="sm">
        <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</FormLabel>
        <Select
          size="sm"
          value={statusFilter}
          onChange={(e) => e && setStatusFilter((e.target as HTMLSelectElement).value)}
          placeholder="Filter by status"
          sx={{
            color: '#fff',
            bgcolor: 'rgba(30, 30, 30, 0.8)',
            '& .MuiSelect-indicator': { color: '#fff' },
            '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' }
          }}
        >
          <Option value="all">All</Option>
          <Option value="active">Active</Option>
          <Option value="expired">Expired</Option>
          <Option value="blocked">Blocked</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Payment</FormLabel>
        <Select
          size="sm"
          value={amountFilter}
          onChange={(e) => e && setAmountFilter((e.target as HTMLSelectElement).value)}
          placeholder="Filter by payment"
          sx={{
            color: '#fff',
            bgcolor: 'rgba(30, 30, 30, 0.8)',
            '& .MuiSelect-indicator': { color: '#fff' },
            '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' }
          }}
        >
          <Option value="all">All</Option>
          <Option value="paid">Paid</Option>
          <Option value="unpaid">Unpaid</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Plan</FormLabel>
        <Select
          size="sm"
          value={planFilter}
          onChange={(e) => e && setPlanFilter((e.target as HTMLSelectElement).value)}
          placeholder="Filter by plan"
          sx={{
            color: '#fff',
            bgcolor: 'rgba(30, 30, 30, 0.8)',
            '& .MuiSelect-indicator': { color: '#fff' },
            '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' }
          }}
        >
          <Option value="all">All</Option>
          <Option value="Basic">Basic</Option>
          <Option value="Premium">Premium</Option>
          <Option value="Gold">Gold</Option>
        </Select>
      </FormControl>
    </>
  );

  return (
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ 
          display: { xs: "flex", sm: "none" }, 
          my: 1, 
          gap: 1,
          bgcolor: 'transparent',
          boxShadow: 'none'
        }}
      >
        <Input
          size="sm"
          placeholder="Search members..."
          startDecorator={<SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
          sx={{ 
            flexGrow: 1, 
            color: '#fff',
            bgcolor: 'rgba(30, 30, 30, 0.8)',
            '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' },
            '& .MuiInput-input::placeholder': { color: 'rgba(255, 255, 255, 0.5)' }
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton 
          size="sm" 
          variant="outlined" 
          color="neutral" 
          onClick={() => setIsFilterOpen(true)}
          sx={{ color: '#fff', borderColor: 'rgba(255, 255, 255, 0.3)' }}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
          <ModalDialog 
            aria-labelledby="filter-modal" 
            layout="fullscreen"
            sx={{ bgcolor: '#000', color: '#fff' }}
          >
            <ModalClose sx={{ color: '#fff' }} />
            <Typography id="filter-modal" level="h2" sx={{ color: '#fff' }}>
              Filters
            </Typography>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
            <Sheet sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 2,
              bgcolor: 'transparent',
              boxShadow: 'none'
            }}>
              {renderFilters()}
              <Button 
                color="primary" 
                onClick={() => setIsFilterOpen(false)}
                sx={{ bgcolor: 'rgba(70, 130, 180, 0.8)', color: '#fff' }}
              >
                Apply Filters
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>

      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": { minWidth: { xs: "120px", md: "160px" } },
          bgcolor: 'transparent'
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Search members</FormLabel>
          <Input
            size="sm"
            placeholder="Search by name, email or phone"
            startDecorator={<SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              color: '#fff',
              bgcolor: 'rgba(30, 30, 30, 0.8)',
              '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' },
              '& .MuiInput-input::placeholder': { color: 'rgba(255, 255, 255, 0.5)' }
            }}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      <Sheet 
        variant="outlined" 
        sx={{ 
          width: "100%", 
          borderRadius: "sm", 
          flexShrink: 1, 
          overflow: "auto",
          bgcolor: 'rgba(20, 20, 20, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        <Table
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": "rgba(25, 25, 25, 0.9)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "rgba(40, 40, 40, 0.5)",
            "--TableCell-paddingY": "8px",
            "--TableCell-paddingX": "12px",
            color: '#fff',
            '& thead th': { color: '#fff', fontWeight: 'bold' },
            '& tbody td': { color: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)' },
            '& tbody tr:hover td': { color: '#fff' }
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
                        color: '#fff',
                        bgcolor: 'transparent',
                        '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' },
                        "& svg": {
                          transition: "0.2s",
                          transform:
                            orderBy === headCell.id && order === "asc" ? "rotate(180deg)" : "none",
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
            {filteredMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <tr key={member.id}>
                  <td>
                    <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      #{member.id}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar
                        size="sm"
                        src={member.photo}
                        sx={{ 
                          bgcolor: member.photo ? "transparent" : 'rgba(60, 60, 60, 0.8)', 
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {!member.photo && member.first_name[0]}
                      </Avatar>
                      <div>
                        <Typography level="body-sm" fontWeight="medium" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {member.first_name} {member.last_name}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {member.email}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {formatPhoneNumber(member.phone?.toString() || "")}
                    </Typography>
                  </td>
                  <td>
                    <Box>
                      <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        ₹{member.amount_paid}
                      </Typography>
                      <Typography level="body-xs" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {member.membership_plan.name} Plan
                      </Typography>
                    </Box>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={{
                        active: <CheckRoundedIcon />,
                        expired: <AutorenewRoundedIcon />,
                        blocked: <BlockIcon />,
                      }[member.membership_status]}
                      color={
                        {
                          active: "success",
                          expired: "neutral",
                          blocked: "danger",
                        }[member.membership_status] as ColorPaletteProp
                      }
                      sx={{
                        bgcolor: {
                          active: 'rgba(40, 120, 40, 0.3)',
                          expired: 'rgba(100, 100, 100, 0.3)',
                          blocked: 'rgba(180, 40, 40, 0.3)',
                        }[member.membership_status],
                        color: {
                          active: '#a0ffa0',
                          expired: '#ffffff',
                          blocked: '#ffa0a0',
                        }[member.membership_status],
                      }}
                    >
                      {member.membership_status}
                    </Chip>
                  </td>
                  <td>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleViewMember(member.id)}
                          sx={{ color: '#fff' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Member">
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onClick={() => handleEditMember(member.id)}
                          sx={{ color: '#fff' }}
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
                                sx: { color: '#fff' }
                              } 
                            }}
                          >
                            <MoreHorizRoundedIcon />
                          </MenuButton>
                          <Menu 
                            size="sm" 
                            sx={{ 
                              minWidth: 140,
                              bgcolor: 'rgba(30, 30, 30, 0.95)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              '& .MuiMenuItem-root': {
                                color: '#fff',
                                '&:hover': { bgcolor: 'rgba(60, 60, 60, 0.7)' }
                              }
                            }}
                          >
                            <MenuItem onClick={() => handleBlockMember(member.id)} color="danger">
                              {member.membership_status === 'blocked' ? 'Unblock Member' : 'Block Member'}
                            </MenuItem>
                            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                            <MenuItem onClick={() => router.push(`/admin/membermanagement/payments/${member.id}`)}>
                              Payment History
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
      </Sheet>

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
        <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Showing {Math.min(filteredMembers.length, (page + 1) * rowsPerPage)} of {filteredMembers.length} members
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
              color: '#fff', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' },
              '&.Mui-disabled': { 
                color: 'rgba(255, 255, 255, 0.3)', 
                borderColor: 'rgba(255, 255, 255, 0.1)' 
              }
            }}
          >
            Previous
          </Button>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {Array.from({ length: Math.ceil(filteredMembers.length / rowsPerPage) }, (_, i) => (
              <IconButton
                key={i}
                size="sm"
                variant={page === i ? "outlined" : "plain"}
                color="neutral"
                onClick={() => setPage(i)}
                sx={{ 
                  color: '#fff', 
                  borderColor: page === i ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' }
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
            disabled={page >= Math.ceil(filteredMembers.length / rowsPerPage) - 1}
            onClick={() => setPage(page + 1)}
            sx={{ 
              color: '#fff', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { bgcolor: 'rgba(40, 40, 40, 0.8)' },
              '&.Mui-disabled': { 
                color: 'rgba(255, 255, 255, 0.3)', 
                borderColor: 'rgba(255, 255, 255, 0.1)' 
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
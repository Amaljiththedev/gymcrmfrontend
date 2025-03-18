import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Box,
  Chip
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Table Container (100% width but no overflow)
const StyledTableContainer = styled(TableContainer)({
  width: "100%",
  maxWidth: "100%",
  backgroundColor: "#1a1a1a",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  borderRadius: "12px",
  overflow: "hidden",
});

// Styled Table Head
const StyledTableHead = styled(TableHead)({
  backgroundColor: "#2a2a2a",
});

// Styled Table Cell
const StyledHeaderCell = styled(TableCell)({
  fontWeight: 600,
  color: "#ffffff",
  fontSize: "0.9rem",
  padding: "12px",
  borderBottom: "1px solid rgba(81, 81, 81, 1)",
});

const StyledTableRow = styled(TableRow)({
  "&:nth-of-type(odd)": { backgroundColor: "#232323" },
  "&:hover": { backgroundColor: "#2c2c2c", transition: "background-color 0.2s ease" },
});

const StyledTableCell = styled(TableCell)({
  padding: "12px",
  fontSize: "0.9rem",
  color: "#ffffff",
  borderBottom: "1px solid rgba(81, 81, 81, 0.5)",
});

// Dummy Data
const dummyData = [
  { id: 1, name: "Basic", enrollments: 150, revenue: 2998.5, date: "2024-01-15" },
  { id: 2, name: "Pro", enrollments: 200, revenue: 9998.0, date: "2024-02-10" },
  { id: 3, name: "Elite", enrollments: 130, revenue: 10398.7, date: "2024-03-05" },
  { id: 4, name: "Annual", enrollments: 220, revenue: 32997.8, date: "2024-04-20" },
];

// Format Date
const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(dateString));

const getPlanColor = (planName: string) => {
  switch (planName) {
    case "Basic": return "#6eff6e";
    case "Pro": return "#64b5f6";
    case "Elite": return "#ce93d8";
    case "Annual": return "#ffb74d";
    default: return "#a0a0a0";
  }
};

export default function PlanTable() {
  return (
    <Box sx={{ padding: "20px", backgroundColor: "#121212", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "95%", maxWidth: "1200px" }}>
        <Typography variant="h5" fontWeight="600" color="#ffffff" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <Box component="span" sx={{ mr: 1, color: "#64b5f6" }}>│</Box>
          Membership Plans Overview
        </Typography>
        <StyledTableContainer component={Paper} className="w-full">
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledHeaderCell>Plan</StyledHeaderCell>
                <StyledHeaderCell align="right">Enrollments</StyledHeaderCell>
                <StyledHeaderCell align="right">Revenue</StyledHeaderCell>
                <StyledHeaderCell align="right">Date</StyledHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {dummyData.map((plan) => (
                <StyledTableRow key={plan.id}>
                  <StyledTableCell>
                    <Chip
                      label={plan.name}
                      size="small"
                      sx={{
                        backgroundColor: `${getPlanColor(plan.name)}20`,
                        color: getPlanColor(plan.name),
                        fontWeight: 500,
                        borderRadius: "4px",
                        padding: "0 6px",
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">{plan.enrollments}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Typography fontWeight="500" color="#64b5f6">
                      ${plan.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right" sx={{ color: "#b0b0b0", fontWeight: 400 }}>
                    {formatDate(plan.date)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Box>
    </Box>
  );
}

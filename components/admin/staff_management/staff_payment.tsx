"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";

// Redux slices
import {
  fetchSalaryHistory,
  SalaryHistory,
} from "@/src/features/salaryslip/staffSalarySlice";
import {
  downloadSalarySlip,
} from "@/src/features/salaryslip/staffSalarySlice";

// MUI Joy UI
import {
  Box,
  Button,
  CssVarsProvider,
  Table,
  Sheet,
  Typography,
  extendTheme,
  IconButton,
  Tooltip,
} from "@mui/joy";
import {
  KeyboardArrowRight as ArrowRight,
  KeyboardArrowLeft as ArrowLeft,
  Download as DownloadIcon,
} from "@mui/icons-material";

// Custom dark theme
const darkTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#000",
          surface: "rgba(0, 0, 0, 0.8)",
        },
        text: {
          primary: "#fff",
          secondary: "rgba(255,255,255,0.7)",
        },
      },
    },
  },
});

export default function StaffSalaryHistoryTable() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading } = useSelector((state: RootState) => state.salary);
  const { slipUrl } = useSelector((state: RootState) => state.salarySlip);

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    if (id) dispatch(fetchSalaryHistory(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (slipUrl) {
      const link = document.createElement("a");
      link.href = slipUrl;
      link.setAttribute("download", "salary_slip.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [slipUrl]);

  const paginatedData = useMemo(() => {
    return history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [history, page, rowsPerPage]);

  const handleDownload = (record: SalaryHistory) => {
    dispatch(downloadSalarySlip({ historyId: record.id }));
  };

  return (
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      <Typography level="h4" sx={{ color: "#fff", mb: 2 }}>
        Staff Salary History
      </Typography>

      <Sheet variant="outlined" sx={{ bgcolor: "#121212", borderRadius: "sm" }}>
        <Table hoverRow stickyHeader>
          <thead>
            <tr>
              <th>#</th>
              <th>Staff Name</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Credited Date</th>
              <th>Due Date</th>
              <th>Created At</th>
              <th>Salary Slip</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.staff?.first_name} {record.staff?.last_name}</td>
                <td>{record.staff?.email}</td>
                <td>₹{record.salary}</td>
                <td>{record.salary_credited_date}</td>
                <td>{record.salary_due_date}</td>
                <td>{new Date(record.created_at).toLocaleString()}</td>
                <td>
                  <Tooltip title="Download Salary Slip">
                    <IconButton size="sm" onClick={() => handleDownload(record)}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Button
          size="sm"
          startDecorator={<ArrowLeft />}
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          size="sm"
          endDecorator={<ArrowRight />}
          disabled={page >= Math.ceil(history.length / rowsPerPage) - 1}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
    </CssVarsProvider>
  );
}

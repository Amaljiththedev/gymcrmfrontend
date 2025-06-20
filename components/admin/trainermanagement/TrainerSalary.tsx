"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import {
  fetchTrainerSalaryHistory,
  downloadTrainerSalarySlip,
  clearTrainerSlipUrl,
} from "@/src/features/salaryslip/trainerSalarySlice";
import {
  CssVarsProvider,
  extendTheme,
  Sheet,
  Table,
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/joy";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const darkTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#000",
          surface: "rgba(0,0,0,0.8)",
        },
        text: {
          primary: "#fff",
          secondary: "rgba(255,255,255,0.7)",
        },
      },
    },
  },
});

export default function TrainerSalaryHistoryTable() {
  const { id } = useParams<{ id: string }>();
  const trainerId = Number(id);
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error, slipUrl } = useSelector(
    (s: RootState) => s.trainerSalarySlice
  );

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // fetch on mount or id change
  useEffect(() => {
    if (!isNaN(trainerId)) {
      dispatch(fetchTrainerSalaryHistory(trainerId));
    }
  }, [dispatch, trainerId]);

  // auto‑open downloaded PDF
  useEffect(() => {
    if (slipUrl) {
      window.open(slipUrl, "_blank");
      dispatch(clearTrainerSlipUrl());
    }
  }, [slipUrl, dispatch]);

  const handleDownload = (historyId: number) => {
    dispatch(downloadTrainerSalarySlip({ historyId }));
  };

  const pageCount = Math.ceil(history.length / rowsPerPage);

  return (
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "sm",
          overflow: "auto",
          bgcolor: "rgba(20,20,20,0.6)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {loading && (
          <Typography level="body-md" sx={{ p: 2, color: "#fff" }}>
            Loading…
          </Typography>
        )}
        {error && (
          <Typography level="body-md" color="danger" sx={{ p: 2 }}>
            {error}
          </Typography>
        )}
        {!loading && !error && (
          <Table
            stickyHeader
            hoverRow
            sx={{
              "--TableCell-headBackground": "rgba(25,25,25,0.9)",
              "--TableRow-hoverBackground": "rgba(40,40,40,0.5)",
              color: "#fff",
              "& thead th": { color: "#fff", fontWeight: "bold" },
              "& tbody td": { borderColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <thead>
              <tr>
                {[
                  { id: "id", label: "ID" },
                  { id: "salary", label: "Amount (₹)" },
                  { id: "credited", label: "Credited On" },
                  { id: "due", label: "Due Date" },
                  { id: "created", label: "Recorded At" },
                  { id: "actions", label: "Actions" },
                ].map((col) => (
                  <th key={col.id} style={{ padding: "12px 6px" }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: { id: number; salary: any; salary_credited_date: string | number | Date; salary_due_date: string | number | Date; created_at: string | number | Date; }) => (
                  <tr key={row.id}>
                    <td>
                      <Typography level="body-sm">#{row.id}</Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {Number(row.salary).toLocaleString()}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {new Date(row.salary_credited_date).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {new Date(row.salary_due_date).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {new Date(row.created_at).toLocaleString()}
                      </Typography>
                    </td>
                    <td>
                      <IconButton
                        size="sm"
                        onClick={() => typeof row.id === "number" && handleDownload(row.id)}
                        sx={{ color: "#fff" }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Sheet>

      {/* pagination */}
      {history.length > rowsPerPage && (
        <Box
          sx={{
            pt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <Typography level="body-sm">
            Showing {Math.min((page + 1) * rowsPerPage, history.length)} of{" "}
            {history.length}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="sm"
              variant="outlined"
              startDecorator={<KeyboardArrowLeftIcon />}
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              {Array.from({ length: pageCount }, (_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i ? "solid" : "plain"}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </Box>

            <Button
              size="sm"
              variant="outlined"
              endDecorator={<KeyboardArrowRightIcon />}
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </CssVarsProvider>
  );
}

/**  app/admin/staff/[id]/page.tsx  */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

/* ---------- Redux -------------- */
import {
  fetchStaffDetail,
  updateStaff,
  Staff,
} from "@/src/features/staff/staffSlice";
import { RootState, AppDispatch } from "@/src/store/store";

/* ---------- Joy UI ------------- */
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import CardActions from "@mui/joy/CardActions";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";

/* ---------- Icons -------------- */
import EmailIcon from "@mui/icons-material/EmailRounded";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import MoneyIcon from "@mui/icons-material/AttachMoney";

/* ---------- Date Picker -------- */
import { DatePicker } from "@/components/ui/date-picker";

/* ---------- Transparent theme object (same as your create form) --- */
const transparentThemeStyles = {
  backgroundColor: "transparent",
  color: "#ffffff",
  "& .MuiFormLabel-root": { color: "#ffffff" },
  "& .MuiInput-root": {
    backgroundColor: "transparent",
    borderRadius: "8px",
    border: "1px solid #ffffff",
    color: "#ffffff",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
    "&:focus-within": {
      borderColor: "#6a6fff",
      boxShadow: "0 0 0 2px rgba(106,111,255,0.2)",
    },
  },
  "& .MuiSelect-root": {
    backgroundColor: "transparent",
    borderRadius: "8px",
    border: "1px solid #ffffff",
    color: "#ffffff",
  },
  "& .MuiCard-root": {
    backgroundColor: "transparent",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(255,255,255,0.1)",
    border: "1px solid #ffffff",
  },
  "& .MuiDivider-root": { backgroundColor: "#ffffff" },
  "& .MuiButton-root": {
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
  },
  "& .MuiCardOverflow-root": { borderTop: "1px solid #ffffff" },
};

/* ================================================================== */
/*                           Component                                */
/* ================================================================== */
export default function UpdateStaff() {
  const { id } = useParams<{ id: string }>(); // /admin/staff/[id]
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  /* -------- Redux state -------- */
  const { detail, updateLoading } = useSelector((s: RootState) => s.staff);

  /* -------- Local state -------- */
  const [departments, setDepartments] = useState<
    { value: string; label: string }[]
  >([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    department: "",
    salary: "",
    salaryCreditedDate: "",
  });

  /* -------- Fetch departments & staff -------- */
  useEffect(() => {
    axios.get("/staff/departments/").then((r) => setDepartments(r.data));
    dispatch(fetchStaffDetail(Number(id))).unwrap();
  }, [dispatch, id]);

  /* -------- Hydrate when detail arrives -------- */
  useEffect(() => {
    if (detail) {
      setFormData({
        firstName: detail.first_name,
        lastName: detail.last_name,
        email: detail.email,
        phoneNumber: detail.phone_number,
        address: detail.address,
        department: detail.department,
        salary: detail.salary,
        salaryCreditedDate: detail.salary_credited_date,
      });
      setStartDate(new Date(detail.salary_credited_date));
    }
  }, [detail]);

  /* -------- Validation (same style) -------- */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName) e.firstName = "First name is required ✨";
    if (!formData.lastName) e.lastName = "Last name is required ✨";
    if (
      !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    )
      e.email = "Enter a valid email 💌";
    if (!formData.department) e.department = "Select a department 👩‍💼";
    if (Number(formData.salary) <= 0) e.salary = "Salary must be positive 💰";
    if (!formData.salaryCreditedDate)
      e.salaryCreditedDate = "Choose a salary day 📅";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* -------- Submit -------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(
        updateStaff({
          id: Number(id),
          staffData: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
            address: formData.address,
            department: formData.department,
            salary: formData.salary,
            salary_credited_date: formData.salaryCreditedDate,
          },
        })
      ).unwrap();
      toast.success("Staff updated successfully 🎉");
      router.push("/admin/staff");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  /* ================================================================= */
  /*                              JSX                                  */
  /* ================================================================= */
  return (
    <Box sx={{ ...transparentThemeStyles, flex: 1, minHeight: "100vh", p: 3 }}>
      <Stack spacing={4} sx={{ maxWidth: 800, mx: "auto" }}>
        <Card variant="outlined" component="form" onSubmit={handleSubmit}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              level="h3"
              sx={{ mb: 2, color: "#fff", fontWeight: 700, fontSize: "1.75rem" }}
            >
              Update Staff
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {/* ---------- Personal ---------- */}
            <Stack spacing={3}>
              <Typography level="title-md" sx={{ color: "#fff", mb: 1 }}>
                Personal Information
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl error={!!errors.firstName} sx={{ flex: 1 }}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    variant="soft"
                    startDecorator={<PersonIcon />}
                  />
                  {errors.firstName && (
                    <FormHelperText sx={{ color: "#ff4d4f" }}>
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl error={!!errors.lastName} sx={{ flex: 1 }}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    variant="soft"
                    startDecorator={<PersonIcon />}
                  />
                  {errors.lastName && (
                    <FormHelperText sx={{ color: "#ff4d4f" }}>
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>

              <FormControl error={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  startDecorator={<EmailIcon />}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  variant="soft"
                />
                {errors.email && (
                  <FormHelperText sx={{ color: "#ff4d4f" }}>
                    {errors.email}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  variant="soft"
                  startDecorator={<PhoneIcon />}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  variant="soft"
                  startDecorator={<HomeIcon />}
                />
              </FormControl>

              {/* ---------- Employment ---------- */}
              <Typography level="title-md" sx={{ color: "#fff", mb: 1, mt: 2 }}>
                Employment Details
              </Typography>

              <FormControl error={!!errors.department}>
                <FormLabel>Department</FormLabel>
                <Select
                  value={formData.department}
                  onChange={(_, val) =>
                    setFormData({ ...formData, department: val as string })
                  }
                  variant="soft"
                  startDecorator={<BadgeIcon />}
                  sx={{ backgroundColor: "transparent" }}
                >
                  {departments.map((d) => (
                    <Option key={d.value} value={d.value}>
                      {d.label}
                    </Option>
                  ))}
                </Select>
                {errors.department && (
                  <FormHelperText sx={{ color: "#ff4d4f" }}>
                    {errors.department}
                  </FormHelperText>
                )}
              </FormControl>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl error={!!errors.salary} sx={{ flex: 1 }}>
                  <FormLabel>Salary</FormLabel>
                  <Input
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    variant="soft"
                    startDecorator={<MoneyIcon />}
                  />
                  {errors.salary && (
                    <FormHelperText sx={{ color: "#ff4d4f" }}>
                      {errors.salary}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl error={!!errors.salaryCreditedDate} sx={{ flex: 1 }}>
                  <FormLabel>Salary Day</FormLabel>
                  <DatePicker
                    selectedDate={startDate || new Date()}
                    onDateChange={(d: Date) => {
                      setStartDate(d);
                      setFormData({
                        ...formData,
                        salaryCreditedDate: d.toISOString().split("T")[0],
                      });
                    }}
                  />
                  {errors.salaryCreditedDate && (
                    <FormHelperText sx={{ color: "#ff4d4f" }}>
                      {errors.salaryCreditedDate}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Stack>
          </CardContent>

          <CardOverflow sx={{ p: 3, backgroundColor: "transparent" }}>
            <CardActions sx={{ justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  color: "#fff",
                  backgroundColor: "#ef9a9a",
                  borderColor: "#ef9a9a",
                  "&:hover": { backgroundColor: "#e57373", borderColor: "#e57373" },
                }}
                onClick={() => router.back()}
              >
                Cancel ❌
              </Button>
              <Button
                type="submit"
                loading={updateLoading}
                sx={{
                  backgroundColor: "#ef9a9a",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#e57373" },
                }}
              >
                Save Changes 🚀
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
    </Box>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PasswordIcon from '@mui/icons-material/Password';
import { addRegularStaff } from '@/src/features/staff/staffSlice';
import axios from 'axios';
import { DatePicker } from "@/components/ui/date-picker"; // Custom date picker component

// Transparent theme with white text and crisp styling
const transparentThemeStyles = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  '& .MuiFormLabel-root': { color: '#ffffff' },
  '& .MuiInput-root': {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    border: '1px solid #ffffff',
    color: '#ffffff',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
    '&:focus-within': {
      borderColor: '#6a6fff',
      boxShadow: '0 0 0 2px rgba(106,111,255,0.2)',
    },
  },
  '& .MuiSelect-root': {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    border: '1px solid #ffffff',
    color: '#ffffff',
  },
  '& .MuiCard-root': {
    backgroundColor: 'transparent',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(255,255,255,0.1)',
    border: '1px solid #ffffff',
  },
  '& .MuiDivider-root': { backgroundColor: '#ffffff' },
  '& .MuiButton-root': { borderRadius: '8px', textTransform: 'none', fontWeight: 600 },
  '& .MuiCardOverflow-root': { borderTop: '1px solid #ffffff' },
};

export default function CreateRegularStaff() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    department: '',
    salary: '',
    salaryCreditedDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Department options coming from the backend
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());

  // Fetch department choices from the backend API
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get('/staff/departments/');
        // Assuming response.data is an array of objects with "value" and "label"
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setErrors(prev => ({ ...prev, department: 'Failed to load departments' }));
      }
    }
    fetchDepartments();
  }, []);

  // Validate form fields with friendly messages
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required ✨';
    if (!formData.lastName) newErrors.lastName = 'Last name is required ✨';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Please enter a valid email 💌';
    if (!formData.phoneNumber.match(/^\+?[1-9]\d{1,14}$/))
      newErrors.phoneNumber = 'Invalid phone number 📞';
    if (!formData.department) newErrors.department = 'Select a department 👩‍💼';
    if (Number(formData.salary) <= 0) newErrors.salary = 'Salary must be a positive number 💰';
    if (!formData.salaryCreditedDate) newErrors.salaryCreditedDate = 'Please choose a salary day 📅';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with error catching
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const formPayload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        address: formData.address,
        department: formData.department,
        salary: formData.salary,
        salary_credited_date: formData.salaryCreditedDate,
        salary_credited_day: new Date(formData.salaryCreditedDate).getDate(),
        salary_due_date: new Date(formData.salaryCreditedDate).toISOString().split('T')[0], // Ensure string format
        salary_due_date_string: new Date(formData.salaryCreditedDate).toISOString().split('T')[0],
        photo: '', // Add a default or placeholder value for the photo
      };
    try {
      await dispatch(addRegularStaff(formPayload) as any).unwrap();
      setLoading(false);
      // Reset form data after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        department: '',
        salary: '',
        salaryCreditedDate: '',
      });
      setStartDate(new Date());
      toast.success('Regular staff created successfully! 🎉');
      router.push('/admin/staff');
    } catch (err: any) {
      console.error('Error creating regular staff:', err);
      setLoading(false);
      const errorMsg = err.response?.data?.detail || err.message || 'An unexpected error occurred';
      setErrors(prev => ({ ...prev, general: errorMsg }));
      toast.error(errorMsg);
    }
  };

  return (
    <Box sx={{ ...transparentThemeStyles, flex: 1, width: '100%', minHeight: '100vh', p: 3 }}>
      <Stack spacing={4} sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Card variant="outlined" component="form" onSubmit={handleSubmit}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              level="h3"
              sx={{ mb: 2, color: '#fff', fontWeight: 700, fontSize: '1.75rem' }}
            >
              Create Regular Staff
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {/* Personal Information Section */}
            <Stack spacing={3}>
              <Typography level="title-md" sx={{ color: '#ffffff', mb: 1 }}>
                Personal Information
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                    <FormHelperText sx={{ color: '#ff4d4f' }}>
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
                    <FormHelperText sx={{ color: '#ff4d4f' }}>
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>

              <FormControl error={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  autoComplete="username"
                  startDecorator={<EmailRoundedIcon />}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  variant="soft"
                />
                {errors.email && (
                  <FormHelperText sx={{ color: '#ff4d4f' }}>
                    {errors.email}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl error={!!errors.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  variant="soft"
                  startDecorator={<PhoneIcon />}
                />
                {errors.phoneNumber && (
                  <FormHelperText sx={{ color: '#ff4d4f' }}>
                    {errors.phoneNumber}
                  </FormHelperText>
                )}
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

              <Typography level="title-md" sx={{ color: '#ffffff', mb: 1, mt: 2 }}>
                Employment Details
              </Typography>

              <FormControl error={!!errors.department}>
                <FormLabel>Department</FormLabel>
                <Select
                  value={formData.department}
                  onChange={(e, val) =>
                    setFormData({ ...formData, department: val as string })
                  }
                  variant="soft"
                  startDecorator={<BadgeIcon />}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  {departments.map((dept) => (
                    <Option key={dept.value} value={dept.value}>
                      {dept.label}
                    </Option>
                  ))}
                </Select>
                {errors.department && (
                  <FormHelperText sx={{ color: '#ff4d4f' }}>
                    {errors.department}
                  </FormHelperText>
                )}
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl error={!!errors.salary} sx={{ flex: 1 }}>
                  <FormLabel>Salary</FormLabel>
                  <Input
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    variant="soft"
                    startDecorator={<AttachMoneyIcon />}
                  />
                  {errors.salary && (
                    <FormHelperText sx={{ color: '#ff4d4f' }}>
                      {errors.salary}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl error={!!errors.salaryCreditedDate} sx={{ flex: 1 }}>
                  <FormLabel>Salary Day</FormLabel>
                  <DatePicker
                    selectedDate={startDate}
                    onDateChange={(date: Date) => {
                      setStartDate(date);
                      // Save the date as ISO string (YYYY-MM-DD) and also compute the day of month
                      setFormData({
                        ...formData,
                        salaryCreditedDate: date.toISOString().split('T')[0],
                      });
                    }}
                  />
                  {errors.salaryCreditedDate && (
                    <FormHelperText sx={{ color: '#ff4d4f' }}>
                      {errors.salaryCreditedDate}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Stack>
          </CardContent>

          <CardOverflow sx={{ p: 3, backgroundColor: 'transparent' }}>
            <CardActions sx={{ justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#ef9a9a',
                  borderColor: '#ef9a9a',
                  '&:hover': { backgroundColor: '#e57373', borderColor: '#e57373' },
                }}
              >
                Cancel ❌
              </Button>
              <Button
                type="submit"
                loading={loading}
                sx={{
                  backgroundColor: '#ef9a9a',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#e57373' },
                }}
              >
                Create Regular Staff 🚀
              </Button>
            </CardActions>
            {errors.general && (
              <FormHelperText sx={{ color: '#ff4d4f', textAlign: 'center', mt: 1 }}>
                {errors.general}
              </FormHelperText>
            )}
          </CardOverflow>
        </Card>
      </Stack>
    </Box>
  );
}

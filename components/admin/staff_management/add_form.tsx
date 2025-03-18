"use client";
import * as React from 'react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CssVarsProvider, styled } from '@mui/joy/styles';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Typography
} from '@mui/joy';
import {
  Email,
  Home,
  KeyboardArrowRight,
  PersonAdd,
  Phone,
  AttachMoney
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==========================================
// Dummy Backend Function (simulate slice dispatch)
// ==========================================
const createStaffDummy = (staffData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Simulate a 1.5s network delay and then resolve
    setTimeout(() => {
      console.log("Dummy staff created:", staffData);
      resolve(staffData);
    }, 1500);
  });
};

// ==========================================
// Styled Components & Animation Wrappers
// ==========================================
const MotionCard = motion(Card);
const MotionBox = motion(Box);

// ==========================================
// Style Objects
// ==========================================
const styles = {
  formContainer: {
    width: '100%',
    minHeight: '100vh',
    margin: 0,
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 'xl',
    p: { xs: 2, sm: 4 },
    background: 'linear-gradient(135deg, rgba(20,20,40,0.8), rgba(10,10,30,0.9))',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(139,92,246,0.1), transparent 60%)',
      zIndex: 0,
    },
  },
  sectionCard: {
    bgcolor: 'rgba(15,15,35,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'lg',
    p: 3,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    zIndex: 1,
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.3)',
      transform: 'translateY(-4px)',
      boxShadow:
        '0 15px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1) inset',
    },
  },
  input: {
    bgcolor: 'rgba(10,10,25,0.5)',
    border: '1px solid rgba(255,255,255,0.15)',
    fontSize: '1.2rem',
    py: 2,
    borderRadius: '10px',
    transition: 'all 0.25s ease',
    color: 'rgba(255,255,255,0.95)',
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.3)',
      bgcolor: 'rgba(20,20,40,0.5)',
    },
    '&:focus-within': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.25)',
      bgcolor: 'rgba(25,25,45,0.6)',
    },
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    mb: 1,
    fontWeight: '600',
    fontSize: '1.2rem',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  button: {
    px: 4,
    py: 1.5,
    fontSize: '1rem',
    fontWeight: '700',
    background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
      background: 'linear-gradient(45deg, #5a5de8, #7c4fe9)',
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    color: 'white',
    fontWeight: '700',
    fontSize: '1.25rem',
    '& svg': {
      transition: 'all 0.3s ease',
    },
    '&:hover svg': {
      transform: 'scale(1.15)',
      color: '#8b5cf6',
    },
  },
  requiredBadge: {
    display: 'inline-flex',
    ml: 1,
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.6)',
    bgcolor: 'rgba(99,102,241,0.2)',
    px: 1,
    py: 0.3,
    borderRadius: '4px',
    alignItems: 'center',
  },
  submitSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 4,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '80%',
      height: '1px',
      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
      top: '-20px',
      left: '10%',
    },
  }
};

// ==========================================
// Animation Variants
// ==========================================
const animations = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  },
  itemVariants: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
  },
  fadeInVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }
};

// ==========================================
// Main Component: StaffCreationForm
// ==========================================
export default function StaffCreationForm() {
  const router = useRouter();

  // Personal Information State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Employment Details State
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [salaryCreditedDay, setSalaryCreditedDay] = useState('');
  
  // Role & Credentials State
  const [role, setRole] = useState('regular_staff');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Build staff data payload; only include password if super_staff.
    const staffData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      address,
      department,
      salary: Number(salary),
      salary_credited_day: Number(salaryCreditedDay),
      role,
      ...(role === 'super_staff' && { password }), // Only include password for super_staff
    };

    try {
      // Simulate backend call
      await createStaffDummy(staffData);
      toast.success("Staff member created successfully!");
      router.push("/admin/staffmanagement");
    } catch (error: any) {
      toast.error("Failed to create staff member: " + error.message);
    }
  };

  return (
    <CssVarsProvider defaultMode="dark">
      <ToastContainer />
      <Box sx={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1e, #1a1a2e)', p: { xs: 2, sm: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence>
          <MotionBox
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={styles.formContainer}
          >
            <form onSubmit={handleSubmit}>
              <motion.div variants={animations.containerVariants} initial="hidden" animate="visible">
                <Stack spacing={4} sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
                  
                  {/* --- Header Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                          variant="soft"
                          color="primary"
                          sx={{
                            mb: 2,
                            p: 2,
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                            border: '1px solid rgba(255,255,255,0.1)',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.4)' },
                              '70%': { boxShadow: '0 0 0 10px rgba(99,102,241,0)' },
                              '100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0)' },
                            },
                          }}
                        >
                          <PersonAdd sx={{ fontSize: '2rem', color: 'white' }} />
                        </IconButton>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                        <Typography
                          level="h2"
                          sx={{
                            color: 'white',
                            fontWeight: '800',
                            letterSpacing: '0.5px',
                            background: 'linear-gradient(to right, #fff, #c7d2fe)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          New Staff Enrollment
                        </Typography>
                      </motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
                        <Typography
                          level="body-sm"
                          sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, maxWidth: '600px', mx: 'auto' }}
                        >
                          Enter the details below to enroll a new staff member into the system.
                        </Typography>
                      </motion.div>
                    </Box>
                  </motion.div>
                  
                  {/* --- Personal Information Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard variant="outlined" sx={styles.sectionCard}>
                      <Box sx={{ mb: 3 }}>
                        <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}>
                              <PersonAdd sx={{ fontSize: '1.5rem', color: '#6366f1' }} />
                            </motion.div>
                            Personal Information
                          </Typography>
                        </motion.div>
                        <Divider sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </Box>
                      <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              First Name
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter first name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              Last Name
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter last name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                <Email fontSize="small" />
                              </motion.div>
                              Email
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              type="email"
                              size="lg"
                              sx={styles.input}
                              placeholder="staff.email@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                <Phone fontSize="small" />
                              </motion.div>
                              Phone
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter phone number"
                              startDecorator={<span>+91&nbsp;</span>}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                              <Home fontSize="small" />
                            </motion.div>
                            Address
                          </FormLabel>
                          <Input
                            size="lg"
                            sx={styles.input}
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </FormControl>
                      </Stack>
                    </MotionCard>
                  </motion.div>
                  
                  {/* --- Employment Details Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard variant="outlined" sx={styles.sectionCard}>
                      <Box sx={{ mb: 3 }}>
                        <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}>
                              <AttachMoney sx={{ fontSize: '1.5rem', color: '#6366f1' }} />
                            </motion.div>
                            Employment Details
                          </Typography>
                        </motion.div>
                        <Divider sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </Box>
                      <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              Department
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter department"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              Salary
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              type="number"
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter salary"
                              value={salary}
                              onChange={(e) => setSalary(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            Salary Credited Day
                            <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                              Required
                            </Box>
                          </FormLabel>
                          <Input
                            type="number"
                            size="lg"
                            sx={styles.input}
                            placeholder="Enter day (1-31)"
                            value={salaryCreditedDay}
                            onChange={(e) => setSalaryCreditedDay(e.target.value)}
                          />
                        </FormControl>
                      </Stack>
                    </MotionCard>
                  </motion.div>
                  
                  {/* --- Role & Credentials Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard variant="outlined" sx={styles.sectionCard}>
                      <Box sx={{ mb: 3 }}>
                        <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}>
                              <KeyboardArrowRight sx={{ fontSize: '1.5rem', color: '#6366f1' }} />
                            </motion.div>
                            Role & Credentials
                          </Typography>
                        </motion.div>
                        <Divider sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </Box>
                      <Stack spacing={3}>
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            Role
                            <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                              Required
                            </Box>
                          </FormLabel>
                          <Select
                            size="lg"
                            sx={{ ...styles.input, '& .MuiSelect-indicator': { color: 'rgba(255,255,255,0.5)' } }}
                            placeholder="Select role"
                            value={role}
                            onChange={(_, newValue) => setRole(newValue ?? '')}
                          >
                            <Option value="regular_staff">Regular Staff</Option>
                            <Option value="super_staff">Super Staff</Option>
                          </Select>
                        </FormControl>
                        {role === 'super_staff' && (
                          <FormControl>
                            <FormLabel sx={styles.label}>
                              Password
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              type="password"
                              size="lg"
                              sx={styles.input}
                              placeholder="Set password for login"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </FormControl>
                        )}
                      </Stack>
                    </MotionCard>
                  </motion.div>
                  
                  {/* --- Submit Section --- */}
                  <motion.div variants={animations.fadeInVariants}>
                    <Box sx={styles.submitSection}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          component={motion.button}
                          size="lg"
                          sx={styles.button}
                          type="submit"
                          endDecorator={
                            <motion.div animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                              <PersonAdd />
                            </motion.div>
                          }
                        >
                          Enroll Staff
                        </Button>
                      </motion.div>
                    </Box>
                  </motion.div>
                </Stack>
              </motion.div>
            </form>
          </MotionBox>
        </AnimatePresence>
      </Box>
    </CssVarsProvider>
  );
}

"use client";
import * as React from 'react';
import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; // For Next.js 13 App Router
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
  AccessTime,
  AttachMoney,
  CalendarToday,
  Email,
  FitnessCenter,
  Home,
  KeyboardArrowRight,
  PersonAdd,
  Phone
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState, AppDispatch } from '@/src/store/store';
import { createMember } from '@/src/features/members/memberSlice';
import { fetchMembershipPlans } from '@/src/features/membershipPlans/membershipPlanSlice';

// ==========================================
// Styled Components
// ==========================================
const StyledDateInput = styled(Input)(({ theme }) => ({
  '&::-webkit-calendar-picker-indicator': {
    filter: 'invert(0.8) brightness(1.5) contrast(2)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    '&:hover': {
      filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(220deg)',
      transform: 'scale(1.1)',
    },
  },
}));

const MotionCard = motion(Card);
const MotionBox = motion(Box);

// ==========================================
// Style Objects
// ==========================================
const styles = {
  formContainer: {
    width: '100%',
    height: '100%',
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
// Helper Function
// ==========================================
const getExpiryDate = (startDateStr: string, durationDays: number): string => {
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return "";
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + durationDays);
  return expiryDate.toISOString().slice(0, 10);
};

// ==========================================
// Main Component: MemberEnrollmentForm
// ==========================================
export default function MemberEnrollmentForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { plans, loading: plansLoading, error: plansError } = useSelector(
    (state: RootState) => state.membershipPlans
  );

  // ==========================================
  // State Management
  // ==========================================
  const [activeSection, setActiveSection] = useState<number | null>(null);
  
  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Membership Details
  const [membershipStart, setMembershipStart] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [initialPayment, setInitialPayment] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  
  // Health Information
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dob, setDob] = useState('');

  // ==========================================
  // Effects & Computed Values
  // ==========================================
  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  const focusSection = (index: number) => {
    setActiveSection(index);
  };

  const computedExpiryDate = useMemo(() => {
    if (!membershipStart || !selectedPlan) return "";
    const plan = plans.find((p) => String(p.id) === selectedPlan);
    if (!plan) return "";
    return getExpiryDate(membershipStart, plan.duration_days);
  }, [membershipStart, selectedPlan, plans]);

  const computedDurationMonths = useMemo(() => {
    if (!selectedPlan) return "";
    const plan = plans.find((p) => String(p.id) === selectedPlan);
    if (!plan) return "";
    const months = Math.ceil(plan.duration_days / 30);
    return months.toString();
  }, [selectedPlan, plans]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const memberData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      membership_start: membershipStart,
      membership_plan: Number(selectedPlan),
      amount_paid: Number(initialPayment),
      height: height ? Number(height) : undefined,
      weight: weight ? Number(weight) : undefined,
      dob: dob || undefined,
      is_blocked: false,
      photo: photo || undefined,
    };
    try {
      await dispatch(createMember(memberData)).unwrap();
      toast.success("Member created successfully! 🎉");
      router.push("/admin/membermanagement");
    } catch (error: any) {
      toast.error("Failed to create member 😢: " + error);
    }
  };

  // ==========================================
  // Render Component
  // ==========================================
  return (
    <CssVarsProvider defaultMode="dark">
      <ToastContainer />
      <Box sx={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1e, #1a1a2e)', p: { xs: 2, sm: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence>
          <MotionBox component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={styles.formContainer}>
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
                          New Member Enrollment
                        </Typography>
                      </motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
                        <Typography
                          level="body-sm"
                          sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, maxWidth: '600px', mx: 'auto' }}
                        >
                          Join our fitness community and start your wellness journey today. Fill in all required fields to complete registration.
                        </Typography>
                      </motion.div>
                    </Box>
                  </motion.div>
                  
                  {/* --- Personal Information Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard
                      variant="outlined"
                      sx={styles.sectionCard}
                      onClick={() => focusSection(0)}
                      whileHover={{
                        boxShadow: activeSection === 0 ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)' : '0 15px 30px rgba(0,0,0,0.2)',
                      }}
                      animate={{
                        borderColor: activeSection === 0 ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.1)',
                        boxShadow: activeSection === 0 ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)' : 'none',
                      }}
                    >
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
                              placeholder="Enter your first name"
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
                              placeholder="Enter your last name"
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
                              placeholder="your.email@example.com"
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
                              placeholder="Enter your phone number"
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
                            placeholder="123 Fitness Street, Apt 4B"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </FormControl>
                      </Stack>
                    </MotionCard>
                  </motion.div>
                  
                  {/* --- Membership Details Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard
                      variant="outlined"
                      sx={styles.sectionCard}
                      onClick={() => focusSection(1)}
                      whileHover={{
                        boxShadow: activeSection === 1 
                          ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)' 
                          : '0 15px 30px rgba(0,0,0,0.2)',
                      }}
                      animate={{
                        borderColor: activeSection === 1 
                          ? 'rgba(99,102,241,0.7)' 
                          : 'rgba(255,255,255,0.1)',
                        boxShadow: activeSection === 1 
                          ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)' 
                          : 'none',
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}>
                              <KeyboardArrowRight sx={{ fontSize: '1.5rem', color: '#6366f1' }} />
                            </motion.div>
                            Membership Details
                          </Typography>
                        </motion.div>
                        <Divider sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </Box>
                      <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              Plan
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Select
                              size="lg"
                              sx={{ ...styles.input, '& .MuiSelect-indicator': { color: 'rgba(255,255,255,0.5)' } }}
                              placeholder="Select your membership plan"
                              value={selectedPlan}
                              onChange={(_, newValue) => setSelectedPlan(newValue ?? '')}
                            >
                              {plansLoading ? (
                                <Option value="" disabled>Loading...</Option>
                              ) : plansError ? (
                                <Option value="" disabled>Error loading plans</Option>
                              ) : (
                                plans.map((plan) => (
                                  <Option key={plan.id} value={String(plan.id)} sx={{ bgcolor: 'rgba(15,15,35,0.95)' }}>
                                    {plan.name} - ₹{plan.price} for {plan.duration_days} days
                                  </Option>
                                ))
                              )}
                            </Select>
                          </FormControl>
                          
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                <CalendarToday fontSize="small" />
                              </motion.div>
                              Start Date
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <StyledDateInput
                              type="date"
                              size="lg"
                              sx={styles.input}
                              value={membershipStart}
                              onChange={(e) => setMembershipStart(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            <CalendarToday fontSize="small" />
                            Expiry Date
                          </FormLabel>
                          <Input 
                            size="lg" 
                            sx={styles.input} 
                            placeholder="Automatically calculated" 
                            value={computedExpiryDate} 
                            readOnly 
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            <AccessTime fontSize="small" />
                            Duration (months)
                          </FormLabel>
                          <Input 
                            size="lg" 
                            sx={styles.input} 
                            placeholder="Calculated from plan" 
                            value={computedDurationMonths} 
                            readOnly 
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                              <AttachMoney fontSize="small" />
                            </motion.div>
                            Initial Payment
                            <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                              Required
                            </Box>
                          </FormLabel>
                          <Input
                            type="number"
                            startDecorator={<motion.div whileHover={{ scale: 1.1 }}>₹</motion.div>}
                            size="lg"
                            sx={styles.input}
                            placeholder="0.00"
                            slotProps={{ input: { step: 10 } }}
                            value={initialPayment}
                            onChange={(e) => setInitialPayment(e.target.value)}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel sx={styles.label}>Photo</FormLabel>
                          <Box
                            component="input"
                            type="file"
                            accept="image/*"
                            sx={{
                              ...styles.input,
                              p: 1,
                              border: 'none',
                              bgcolor: 'transparent',
                            }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setPhoto(e.target.files[0]);
                              }
                            }}
                          />
                        </FormControl>
                      </Stack>
                    </MotionCard>
                  </motion.div>
                  
                  {/* --- Health Metrics Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard
                      variant="outlined"
                      sx={styles.sectionCard}
                      onClick={() => focusSection(2)}
                      whileHover={{
                        boxShadow: activeSection === 2 
                          ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)' 
                          : '0 15px 30px rgba(0,0,0,0.2)',
                      }}
                      animate={{
                        borderColor: activeSection === 2 
                          ? 'rgba(99,102,241,0.7)' 
                          : 'rgba(255,255,255,0.1)',
                        boxShadow: activeSection === 2 
                          ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)' 
                          : 'none',
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <motion.div 
                          whileHover={{ x: 5 }} 
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}>
                              <FitnessCenter sx={{ fontSize: '1.5rem', color: '#6366f1' }} />
                            </motion.div>
                            Health Information
                          </Typography>
                        </motion.div>
                        <Typography 
                          level="body-sm" 
                          sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontStyle: 'italic' }}
                        >
                          Optional information to help personalize your fitness journey.
                        </Typography>
                        <Divider sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </Box>
                      <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Height (cm)</FormLabel>
                            <Input
                              type="number"
                              size="lg"
                              sx={styles.input}
                              placeholder="175"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Weight (kg)</FormLabel>
                            <Input
                              type="number"
                              size="lg"
                              sx={styles.input}
                              placeholder="70"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        <FormControl sx={{ flex: 1 }}>
                          <FormLabel sx={styles.label}>
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                              <CalendarToday fontSize="small" />
                            </motion.div>
                            Date of Birth
                          </FormLabel>
                          <StyledDateInput
                            type="date"
                            size="lg"
                            sx={styles.input}
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                          />
                        </FormControl>
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
                          Enroll Member
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

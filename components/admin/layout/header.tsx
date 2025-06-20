"use client";
import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { closeSidebar } from '@/lib/utils';
import { useRouter } from "next/navigation";

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { logoutManager } from '@/src/store/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toggler(props: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; }) => React.ReactNode;
}) {
  const { defaultExpanded = false, renderToggle, children } = props;
  const [open, setOpen] = React.useState(defaultExpanded);
  
  return (
    <>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '& > *': { 
            overflow: 'hidden',
            transition: 'opacity 0.2s ease',
            opacity: open ? 1 : 0,
          },
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [hoveredItem, setHoveredItem] = React.useState<string>('');
  const searchQueryLower = searchQuery.toLowerCase();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Function to filter section items based on search query
  const filterItems = (items: { label: string; id: string; href: string }[]) =>
    items.filter(item => item.label.toLowerCase().includes(searchQueryLower));

  // Sections (your sidebar items)
  const sections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardRoundedIcon />,
      items: [],
      href: '/admin/dashboard',
    },
    {
      id: 'member',
      label: 'Member Management',
      icon: <PeopleRoundedIcon />,
      items: [
        { label: 'Add Member', id: 'add', href: '/admin/membermanagement/add' },
        { label: 'Active Members', id: 'activemembers', href: '/admin/membermanagement/activemembers' },
        { label: 'Expired Members', id: 'expiredmembers', href: '/admin/membermanagement/expiredmembers' },
        { label: 'Payment Issues', id: 'paymentnotcompleted', href: '/admin/membermanagement/paymentnotcompleted' },
        { label: 'Expiry Notifications', id: 'expiry', href: '/admin/membermanagement/expiry' },
      ],
      href: '/admin/membermanagement',
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: <WorkRoundedIcon />,
      items: [
        { label: 'Salary Management', id: 'salarymanagement', href: '/admin/staff/salary' },
        { label: 'Regular Staff', id: 'regularstaff', href: '/admin/staff/regularstaff' },
        { label: 'Super Staff', id: 'superstaff', href: '/admin/staff/superstaff' },
        { label: 'Add Super Staff', id: 'addsuperstaff', href: '/admin/staff/addsuperstaff' },
        { label: 'Add Regular Staff', id: 'addregularstaff', href: '/admin/staff/addregularstaff' },
      ],
      href: '/admin/staff',
    },
    {
      id: 'plan',
      label: 'Plan Management',
      icon: <AssessmentRoundedIcon />,
      items: [
        { label: 'Add Plan', id: 'addplan', href: '/admin/planmanagement/add' },
        { label: 'Plan Reports', id: 'planreports', href: '/admin/planmanagement/reports' },
      ],
      href: '/admin/planmanagement',
    },
    {
      id: 'trainer',
      label: 'Trainer Management',
      icon: <FitnessCenterRoundedIcon />,
      items: [
        { label: 'Add Trainer', id: 'addtrainer', href: '/admin/trainermanagement/add' },
        { label: 'Active Trainers', id: 'activetrainers', href: '/admin/trainermanagement/active' },
        { label: 'Trainer Schedules', id: 'trainerschedules', href: '/admin/trainermanagement/schedules' },
      ],
      href: '/admin/trainermanagement',
    },
    {
      id: 'expense',
      label: 'Expense Management',
      icon: <AttachMoneyRoundedIcon />,
      items: [
        { label: 'Add Expense', id: 'addexpense', href: '/admin/expensemanagement/add' },
        { label: 'Expense History', id: 'expensehistory', href: '/admin/expensemanagement/history' },
      ],
      href: '/admin/expensemanagement',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <AssessmentRoundedIcon />,
      items: [
        { label: 'Membership Report', id: 'membershipreport', href: '/admin/reports/membershipreports' },
        { label: 'Sales Report', id: 'salesreport', href: '/admin/reports/sales' },
        { label: 'Attendance Report', id: 'attendancereport', href: '/admin/reports/attendance' },
        { label: 'Member Demographics', id: 'memberdemographics', href: '/admin/reports/memberdemographics' },
        { label: 'Expense Report', id: 'expensereport', href: '/admin/reports/expensereports' },
        { label: 'Trainer Report', id: 'trainerreport', href: '/admin/reports/trainerreports' },
        { label: 'Staff Report', id: 'staffreport', href: '/admin/reports/staffreports' },
      ],
      href: '/admin/reports',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsRoundedIcon />,
      items: [],
      href: '/admin/settings',
    },
  ];

  // Apple-inspired button styles
  const getButtonStyles = (itemId: string, isNested = false) => ({
    borderRadius: '12px',
    minHeight: isNested ? '36px' : '44px',
    padding: isNested ? '8px 16px' : '12px 16px',
    margin: '2px 0',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: isNested ? '14px' : '15px',
    fontWeight: isNested ? 500 : 600,
    letterSpacing: '-0.01em',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid transparent',
    
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    },
    
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      transform: 'translateY(0px)',
      transition: 'all 0.1s ease',
    },
    
    '&:focus-visible': {
      outline: '2px solid rgba(255, 255, 255, 0.3)',
      outlineOffset: '2px',
    },
    
    // Active state styling
    ...(hoveredItem === itemId && {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    }),
  });

  // Search input styles
  const searchInputStyles = {
    borderRadius: '12px',
    height: '44px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '15px',
    fontWeight: 500,
    letterSpacing: '-0.01em',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(20px)',
    
    '& input': { 
      color: 'rgba(255, 255, 255, 0.9)',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    '&:focus-within': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.1)',
    },
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await dispatch(logoutManager()).unwrap();
      toast.success("Logged out successfully");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      toast.error(`Logout failed: ${error}`);
    }
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 3,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '320px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '360px',
            },
          },
        })}
      />
      
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        paddingBottom: 1,
      }}>
        <Typography 
          level="title-lg" 
          sx={{ 
            flexGrow: 1, 
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          Admin Panel
        </Typography>
        <IconButton 
          variant="plain" 
          sx={{ 
            display: { md: 'none' },
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }} 
          onClick={() => closeSidebar()}
        >
          <CloseRoundedIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
        </IconButton>
      </Box>

      {/* Search Input */}
      <Input
        size="sm"
        startDecorator={
          <SearchRoundedIcon sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '18px'
          }} />
        }
        placeholder="Search navigation..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={searchInputStyles}
      />

      {/* Navigation List */}
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingRight: '2px',
          
          // Custom scrollbar
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
          
          [`& .${listItemButtonClasses.root}`]: { 
            gap: 2, 
            color: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '20px',
            '--ListItem-radius': '12px',
          }}
        >
          {sections.map((section) => {
            const filteredItems = filterItems(section.items);
            const showSection =
              !searchQuery.trim() ||
              section.label.toLowerCase().includes(searchQueryLower) ||
              filteredItems.length > 0;

            return showSection ? (
              <ListItem key={section.id} nested>
                {section.items.length > 0 ? (
                  <Toggler
                    renderToggle={({ open, setOpen }) => (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <ListItemButton 
                          component="a" 
                          href={section.href} 
                          sx={{
                            ...getButtonStyles(section.id),
                            flex: 1,
                          }}
                          onMouseEnter={() => setHoveredItem(section.id)}
                          onMouseLeave={() => setHoveredItem('')}
                        >
                          <Box sx={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                            {section.icon}
                          </Box>
                          <ListItemContent>
                            <Typography 
                              level="title-sm" 
                              sx={{ 
                                color: 'inherit',
                                fontSize: 'inherit',
                                fontWeight: 'inherit',
                              }}
                            >
                              {section.label}
                            </Typography>
                          </ListItemContent>
                        </ListItemButton>
                        <IconButton 
                          onClick={() => setOpen(!open)}
                          sx={{
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            minHeight: '32px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                        >
                          <KeyboardArrowDownIcon
                            sx={{
                              transform: open ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              fontSize: '20px',
                            }}
                          />
                        </IconButton>
                      </Box>
                    )}
                  >
                    <List sx={{ gap: 0.5, paddingTop: 1 }}>
                      {filteredItems.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemButton 
                            component="a" 
                            href={item.href} 
                            sx={getButtonStyles(item.id, true)}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem('')}
                          >
                            <Typography 
                              level="body-sm" 
                              sx={{ 
                                color: 'inherit',
                                fontSize: 'inherit',
                                fontWeight: 'inherit',
                              }}
                            >
                              {item.label}
                            </Typography>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Toggler>
                ) : (
                  <ListItemButton 
                    component="a" 
                    href={section.href} 
                    sx={getButtonStyles(section.id)}
                    onMouseEnter={() => setHoveredItem(section.id)}
                    onMouseLeave={() => setHoveredItem('')}
                  >
                    <Box sx={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                      {section.icon}
                    </Box>
                    <ListItemContent>
                      <Typography 
                        level="title-sm" 
                        sx={{ 
                          color: 'inherit',
                          fontSize: 'inherit',
                          fontWeight: 'inherit',
                        }}
                      >
                        {section.label}
                      </Typography>
                    </ListItemContent>
                  </ListItemButton>
                )}
              </ListItem>
            ) : null;
          })}
        </List>
      </Box>

      {/* Divider */}
      <Divider sx={{ 
        borderColor: 'rgba(255, 255, 255, 0.1)',
        margin: '8px 0',
      }} />
      
      {/* User Profile Section */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      }}>
        <Avatar
          variant="outlined"
          size="sm"
          src={user?.profile_picture ? `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}` : "/default-avatar.png"}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            width: '36px',
            height: '36px',
          }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography 
            level="title-sm" 
            sx={{ 
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography 
            level="body-xs" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {user?.email || "admin@gym.com"}
          </Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          onClick={handleLogout}
          sx={{
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            minHeight: '32px',
            color: 'rgba(255, 255, 255, 0.6)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.9)',
              transform: 'scale(1.05)',
            },
          }}
        >
          <LogoutRoundedIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </Box>
      
      <ToastContainer 
        position="top-right"
        theme="dark"
        style={{
          fontSize: '14px',
        }}
      />
    </Sheet>
  );
}
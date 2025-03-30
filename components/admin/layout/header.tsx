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
import { extendTheme } from '@mui/joy/styles';

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
          transition: '0.2s ease',
          '& > *': { overflow: 'hidden' },
        }}
      >
        {children}
      </Box>
    </>
  );
}

// Define dark theme (using MUI Joy's extendTheme)
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

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = React.useState('');
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
        { label: 'Manage Plans', id: 'manageplans', href: '/admin/planmanagement/manage' },
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
      items: [
        { label: 'Profile Settings', id: 'profilesettings', href: '/admin/settings/profile' },
        { label: 'System Settings', id: 'systemsettings', href: '/admin/settings/system' },
      ],
      href: '/admin/settings',
    },
  ];

  // Example button styles using !important
  const buttonStyles = {
    backgroundColor: 'black !important',
    color: '#fff !important',
    '&:hover': {
      backgroundColor: 'black !important',
      color: '#fff !important',
    },
    '&:active': {
      backgroundColor: 'black !important',
      color: '#fff !important',
    },
    '&:focus': {
      backgroundColor: 'black !important',
      color: '#fff !important',
    },
  };

  // Logout handler using Redux thunk; waits 3 sec before redirecting
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
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'black',
        color: '#fff',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '260px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '280px',
            },
          },
        })}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography level="title-lg" sx={{ flexGrow: 1, color: '#fff' }}>
          Admin
        </Typography>
        <IconButton variant="plain" sx={{ display: { md: 'none' } }} onClick={() => closeSidebar()}>
          <CloseRoundedIcon sx={{ color: '#fff' }} />
        </IconButton>
      </Box>

      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon sx={{ color: '#fff' }} />}
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          backgroundColor: 'transparent',
          color: '#fff',
          '& input': { color: '#fff' },
        }}
      />

      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: { gap: 1.5, color: '#fff' },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
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
                          justifyContent: 'space-between',
                        }}
                      >
                        <ListItemButton component="a" href={section.href} sx={buttonStyles}>
                          {section.icon}
                          <ListItemContent>
                            <Typography level="title-sm" sx={{ color: '#fff' }}>
                              {section.label}
                            </Typography>
                          </ListItemContent>
                        </ListItemButton>
                        <IconButton onClick={() => setOpen(!open)} sx={buttonStyles}>
                          <KeyboardArrowDownIcon
                            sx={{
                              transform: open ? 'rotate(180deg)' : 'none',
                              color: '#fff',
                            }}
                          />
                        </IconButton>
                      </Box>
                    )}
                  >
                    <List sx={{ gap: 0.5 }}>
                      {filteredItems.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemButton component="a" href={item.href} sx={buttonStyles}>
                            {item.label}
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Toggler>
                ) : (
                  <ListItemButton component="a" href={section.href} sx={buttonStyles}>
                    {section.icon}
                    <ListItemContent>
                      <Typography level="title-sm" sx={{ color: '#fff' }}>
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

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant="outlined"
          size="sm"
          src="/path-to-your-avatar.jpg"
          sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm" sx={{ color: '#fff' }}>
            {user?.username || "Admin User"}
          </Typography>
          <Typography level="body-xs" sx={{ color: '#fff' }}>
            {user?.email || "admin@gym.com"}
          </Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          sx={buttonStyles}
          onClick={handleLogout}
        >
          <LogoutRoundedIcon sx={{ color: '#fff' }} />
        </IconButton>
      </Box>
      <ToastContainer />
    </Sheet>
  );
}

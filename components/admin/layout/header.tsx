"use client";

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';

// Theme object with custom colors and settings
const theme = {
  primary: '#ffffff',
  primaryGradient: 'linear-gradient(45deg, #333, #555)',
  hoverBg: '#000000', // native black on hover
  activeBg: 'black', // a slightly lighter black for active state
  text: '#ffffff',
  mutedText: 'white',
  divider: '#333333',
  background: '#000000',
  backgroundGradient: '#000000',
  cardBackground: 'rgba(30, 30, 30, 0.5)',
  shadow:
    '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
};

// Active style for navigation items (with transparent background)
const activeStyle = {
  backgroundColor: 'transparent',
  borderLeft: `4px solid ${theme.primary}`,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiTypography-root, & .MuiSvgIcon-root': {
    color: `${theme.text} !important`,
    fontWeight: '600',
  },
};

interface TogglerProps {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}

// A simple Toggler component that shows/hides its children
function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: TogglerProps) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: open ? '500px' : '0px',
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const searchQueryLower = searchQuery.toLowerCase();

  // Helper to filter submenu items based on search input
  const filterItems = <T extends { label: string }>(items: T[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchQueryLower)
    );
  };

  // Dashboard: show only if its label matches or no search query
  const showDashboard =
    !searchQuery.trim() || 'dashboard'.includes(searchQueryLower);

  // Define submenu items for each section
  const memberItems = [
    { label: 'Add Member', id: 'add', href: '/admin/membermanagement/add' },
    {
      label: 'Active Members',
      id: 'activemembers',
      href: '/admin/membermanagement/activemembers',
    },
    {
      label: 'Expired Members',
      id: 'expiredmembers',
      href: '/admin/membermanagement/expiredmembers',
    },
    {
      label: 'Payment Issues',
      id: 'paymentnotcompleted',
      href: '/admin/membermanagement/paymentnotcompleted',
    },
    {
      label: 'Expiry Notifications',
      id: 'expiry',
      href: '/admin/membermanagement/expiry',
    },
  ];
  const filteredMemberItems = filterItems(memberItems);
  const memberHeaderMatches =
    !searchQuery.trim() ||
    'member management'.includes(searchQueryLower);

  const staffItems = [
    { label: 'Add Staff', id: 'addstaff', href: '/admin/staff/add' },
    {
      label: 'Salary Management',
      id: 'salarymanagement',
      href: '/admin/staff/salary',
    },
  ];
  const filteredStaffItems = filterItems(staffItems);
  const staffHeaderMatches =
    !searchQuery.trim() || 'staff'.includes(searchQueryLower);

  const planItems = [
    { label: 'Add Plan', id: 'addplan', href: '/admin/planmanagement/add' },
    {
      label: 'Manage Plans',
      id: 'manageplans',
      href: '/admin/planmanagement/manage',
    },
    {
      label: 'Plan Reports',
      id: 'planreports',
      href: '/admin/planmanagement/reports',
    },
  ];
  const filteredPlanItems = filterItems(planItems);
  const planHeaderMatches =
    !searchQuery.trim() || 'plan management'.includes(searchQueryLower);

  const trainerItems = [
    { label: 'Add Trainer', id: 'addtrainer', href: '/admin/trainermanagement/add' },
    {
      label: 'Active Trainers',
      id: 'activetrainers',
      href: '/admin/trainermanagement/active',
    },
    {
      label: 'Trainer Schedules',
      id: 'trainerschedules',
      href: '/admin/trainermanagement/schedules',
    },
  ];
  const filteredTrainerItems = filterItems(trainerItems);
  const trainerHeaderMatches =
    !searchQuery.trim() || 'trainer management'.includes(searchQueryLower);

  const settingsItems = [
    {
      label: 'Profile Settings',
      id: 'profilesettings',
      href: '/admin/settings/profile',
    },
    {
      label: 'System Settings',
      id: 'systemsettings',
      href: '/admin/settings/system',
    },
  ];
  const filteredSettingsItems = filterItems(settingsItems);
  const settingsHeaderMatches =
    !searchQuery.trim() || 'settings'.includes(searchQueryLower);

  const expenseItems = [
    { label: 'Add Expense', id: 'addexpense', href: '/admin/expensemanagement/add' },
    {
      label: 'Expense History',
      id: 'expensehistory',
      href: '/admin/expensemanagement/history',
    },
  ];
  const filteredExpenseItems = filterItems(expenseItems);
  const expenseHeaderMatches =
    !searchQuery.trim() || 'expense management'.includes(searchQueryLower);

  const reportsItems = [
    {
      label: 'Membership Report',
      id: 'membershipreport',
      href: '/admin/reports/membershipreports',
    },
    { label: 'Sales Report', id: 'salesreport', href: '/admin/reports/sales' },
    {
      label: 'Attendance Report',
      id: 'attendancereport',
      href: '/admin/reports/attendance',
    },
    {
      label: 'Member Demographics Report',
      id: 'attendancereport',
      href: '/admin/reports/memberdemographics',
    },
    {
      label: 'Expense Report',
      id: 'attendancereport',
      href: '/admin/reports/expensereports',
    },
    {
      label: 'Trainer Report',
      id: 'attendancereport',
      href: '/admin/reports/trainerreports',
    },
    
    {
      label: 'Staff Report',
      id: 'attendancereport',
      href: '/admin/reports/staffreports',
    },
  ];
  const filteredReportsItems = filterItems(reportsItems);
  const reportsHeaderMatches =
    !searchQuery.trim() || 'reports'.includes(searchQueryLower);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition:
          'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 3,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        borderRight: '1px solid',
        borderColor: theme.divider,
        background: theme.backgroundGradient,
        color: theme.text,
        boxShadow: '4px 0 10px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}
    >
      <GlobalStyles
        styles={{
          ':root': {
            '--Sidebar-width': '340px',
            '@media (min-width: 1200px)': {
              '--Sidebar-width': '380px',
            },
          },
          body: {
            background: theme.backgroundGradient,
            color: theme.text,
          },
          '::-webkit-scrollbar': { width: '6px' },
          '::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: 'transparent',
          },
        }}
      />

      {/* Header Section with Logo */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
            width: '40px',
            borderRadius: '10px',
            background: theme.primaryGradient,
            boxShadow: '0 4px 6px -1px rgba(255, 255, 255, 0.3)',
          }}
        >
          <FitnessCenterRoundedIcon
            sx={{ color: theme.text, fontSize: '1.5rem' }}
          />
        </Box>
        <Typography
          level="title-lg"
          sx={{
            fontSize: '1.75rem',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            color: theme.text,
            backgroundImage: 'linear-gradient(90deg, #fff, #fff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Admin
        </Typography>
      </Box>

      {/* Search Input */}
      <Input
        size="sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        startDecorator={<SearchRoundedIcon sx={{ color: theme.text }} />}
        placeholder="Search..."
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          color: theme.text,
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: '#000000',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:focus-within': {
            backgroundColor: '#000000',
            borderColor: theme.primary,
            boxShadow: `0 0 0 3px rgba(255, 255, 255, 0.2)`,
          },
          '&::before': { boxShadow: 'none' },
        }}
      />

      {/* Navigation List */}
      <Box
        sx={{
          minHeight: 0,
          overflow: 'auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          py: 1,
          // Navigation item styles
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: theme.text,
            position: 'relative',
            '& .MuiTypography-root, & .MuiSvgIcon-root': {
              color: theme.mutedText,
              transition: 'color 0.3s ease, transform 0.3s ease',
            },
            '&:hover': {
              backgroundColor: '#000000',
              transform: 'translateX(4px)',
              boxShadow: '0px 0px 8px transparent',
              '& .MuiTypography-root, & .MuiSvgIcon-root': {
                color: theme.text,
              },
              '& .MuiSvgIcon-root:first-of-type': {
                transform: 'scale(1.1)',
              },
            },
          },
        }}
      >
        <List size="sm" sx={{ gap: 1, px: 1 }}>
          {/* Dashboard Item */}
          {showDashboard && (
            <ListItem>
              <ListItemButton
                component="a"
                href="/admin/dashboard"
                sx={pathname === '/admin/dashboard' ? activeStyle : {}}
                onMouseEnter={() => setHoveredItem('dashboard')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <DashboardRoundedIcon
                  sx={{
                    transition: 'all 0.3s ease',
                    transform:
                      hoveredItem === 'dashboard' ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                <ListItemContent>
                  <Typography level="title-sm" sx={{ fontSize: '1.1rem' }}>
                    Dashboard
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          )}

          {/* Member Management Section */}
          {(memberHeaderMatches || filteredMemberItems.length > 0) && (
            <ListItem nested sx={{ mt: 1 }}>
              <Toggler
                defaultExpanded={pathname.startsWith('/admin/membermanagement')}
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton
                    onClick={() => {
                      setOpen(!open);
                      router.push('/admin/membermanagement');
                    }}
                    sx={
                      pathname.startsWith('/admin/membermanagement')
                        ? activeStyle
                        : {}
                    }
                    onMouseEnter={() => setHoveredItem('members')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <GroupRoundedIcon
                      sx={{
                        transition: 'all 0.3s ease',
                        transform:
                          hoveredItem === 'members'
                            ? 'scale(1.1)'
                            : 'scale(1)',
                      }}
                    />
                    <ListItemContent>
                      <Typography level="title-sm" sx={{ fontSize: '1.1rem' }}>
                        Member Management
                      </Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition:
                          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, pl: 2, mt: 1 }}>
                  {filteredMemberItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemButton
                        component="a"
                        href={item.href}
                        sx={{
                          pl: 3,
                          borderRadius: '8px',
                          ...(pathname === item.href ? activeStyle : {}),
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <ListItemContent>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: '1rem',
                              transition: 'transform 0.2s ease',
                              transform:
                                hoveredItem === item.id
                                  ? 'translateX(4px)'
                                  : 'translateX(0)',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Toggler>
            </ListItem>
          )}

          {/* Staff Section */}
          {(staffHeaderMatches || filteredStaffItems.length > 0) && (
            <ListItem nested sx={{ mt: 1 }}>
              <Toggler
                defaultExpanded={pathname.startsWith('/admin/staff')}
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton
                    onClick={() => {
                      setOpen(!open);
                      router.push('/admin/staff');
                    }}
                    sx={pathname === '/admin/staff' ? activeStyle : {}}
                    onMouseEnter={() => setHoveredItem('staff')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <PeopleAltIcon
                      sx={{
                        transition: 'all 0.3s ease',
                        transform:
                          hoveredItem === 'staff' ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                    <ListItemContent>
                      <Typography level="title-sm" sx={{ fontSize: '1.1rem' }}>
                        Staff
                      </Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition:
                          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, pl: 2, mt: 1 }}>
                  {filteredStaffItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemButton
                        component="a"
                        href={item.href}
                        sx={{
                          pl: 3,
                          borderRadius: '8px',
                          ...(pathname === item.href ? activeStyle : {}),
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <ListItemContent>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: '1rem',
                              transition: 'transform 0.2s ease',
                              transform:
                                hoveredItem === item.id
                                  ? 'translateX(4px)'
                                  : 'translateX(0)',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Toggler>
            </ListItem>
          )}

          {/* Plan Management Section */}
          {(planHeaderMatches || filteredPlanItems.length > 0) && (
            <ListItem nested sx={{ mt: 1 }}>
              <Toggler
                defaultExpanded={pathname.startsWith('/admin/planmanagement')}
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton
                    onClick={() => {
                      setOpen(!open);
                      router.push('/admin/planmanagement');
                    }}
                    sx={
                      pathname.startsWith('/admin/planmanagement')
                        ? activeStyle
                        : {}
                    }
                    onMouseEnter={() => setHoveredItem('plans')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <EventNoteIcon
                      sx={{
                        transition: 'all 0.3s ease',
                        transform:
                          hoveredItem === 'plans'
                            ? 'scale(1.1)'
                            : 'scale(1)',
                      }}
                    />
                    <ListItemContent>
                      <Typography level="title-sm" sx={{ fontSize: '1.1rem' }}>
                        Plan Management
                      </Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition:
                          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, pl: 2, mt: 1 }}>
                  {filteredPlanItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemButton
                        component="a"
                        href={item.href}
                        sx={{
                          pl: 3,
                          borderRadius: '8px',
                          ...(pathname === item.href ? activeStyle : {}),
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <ListItemContent>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: '1rem',
                              transition: 'transform 0.2s ease',
                              transform:
                                hoveredItem === item.id
                                  ? 'translateX(4px)'
                                  : 'translateX(0)',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Toggler>
            </ListItem>
          )}

          {/* Trainer Management Section */}
          {(trainerHeaderMatches || filteredTrainerItems.length > 0) && (
            <ListItem nested sx={{ mt: 1 }}>
              <Toggler
                defaultExpanded={pathname.startsWith('/admin/trainermanagement')}
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton
                    onClick={() => {
                      setOpen(!open);
                      router.push('/admin/trainermanagement');
                    }}
                    sx={
                      pathname.startsWith('/admin/trainermanagement')
                        ? activeStyle
                        : {}
                    }
                    onMouseEnter={() => setHoveredItem('trainers')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <FitnessCenterIcon
                      sx={{
                        transition: 'all 0.3s ease',
                        transform:
                          hoveredItem === 'trainers'
                            ? 'scale(1.1)'
                            : 'scale(1)',
                      }}
                    />
                    <ListItemContent>
                      <Typography level="title-sm" sx={{ fontSize: '1.1rem' }}>
                        Trainer Management
                      </Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition:
                          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, pl: 2, mt: 1 }}>
                  {filteredTrainerItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemButton
                        component="a"
                        href={item.href}
                        sx={{
                          pl: 3,
                          borderRadius: '8px',
                          ...(pathname === item.href ? activeStyle : {}),
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <ListItemContent>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: '1rem',
                              transition: 'transform 0.2s ease',
                              transform:
                                hoveredItem === item.id
                                  ? 'translateX(4px)'
                                  : 'translateX(0)',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Toggler>
            </ListItem>
          )}

          {/* Settings Section */}
          {(settingsHeaderMatches || filteredSettingsItems.length > 0) && (
            <ListItem nested sx={{ mt: 1 }}>
              <Toggler
                defaultExpanded={pathname.startsWith('/admin/settings')}
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton
                    onClick={() => {
                      setOpen(!open);
                      router.push('/admin/settings');
                    }}
                    sx={pathname.startsWith('/admin/settings') ? activeStyle : {}}
                    onMouseEnter={() => setHoveredItem('settings')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <SettingsIcon
                      sx={{
                        transition: 'all 0.3s ease',
                        transform:
                          hoveredItem === 'settings'
                            ? 'scale(1.1) rotate(30deg)'
                            : 'scale(1) rotate(0deg)',
                      }}
                    />
                    <ListItemContent>
                      <Typography level="title-sm" sx={{ fontSize: '1.1rem' }}>
                        Settings
                      </Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition:
                          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, pl: 2, mt: 1 }}>
                  {filteredSettingsItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemButton
                        component="a"
                        href={item.href}
                        sx={{
                          pl: 3,
                          borderRadius: '8px',
                          ...(pathname === item.href ? activeStyle : {}),
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <ListItemContent>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: '1rem',
                              transition: 'transform 0.2s ease',
                              transform:
                                hoveredItem === item.id
                                  ? 'translateX(4px)'
                                  : 'translateX(0)',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Toggler>
            </ListItem>
          )}

          {/* Expense Management Section */}
          {(expenseHeaderMatches || filteredExpenseItems.length > 0) && (
            <ListItem nested sx={{ mt: 1 }}>
              <Toggler
                defaultExpanded={pathname.startsWith('/admin/expensemanagement')}
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton
                    onClick={() => {
                      setOpen(!open);
                      router.push('/admin/expensemanagement');
                    }}
                    sx={
                      pathname.startsWith('/admin/expensemanagement')
                        ? activeStyle
                        : {}
                    }
                    onMouseEnter={() => setHoveredItem('expenses')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <AttachMoneyIcon
                      sx={{
                        transition: 'all 0.3s ease',
                        transform:
                          hoveredItem === 'expenses'
                            ? 'scale(1.1)'
                            : 'scale(1)',
                      }}
                    />
                    <ListItemContent>
                      <Typography level="title-sm" sx={{ fontSize: '1.1rem' }}>
                        Expense Management
                      </Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition:
                          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, pl: 2, mt: 1 }}>
                  {filteredExpenseItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemButton
                        component="a"
                        href={item.href}
                        sx={{
                          pl: 3,
                          borderRadius: '8px',
                          ...(pathname === item.href ? activeStyle : {}),
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <ListItemContent>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: '1rem',
                              transition: 'transform 0.2s ease',
                              transform:
                                hoveredItem === item.id
                                  ? 'translateX(4px)'
                                  : 'translateX(0)',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Toggler>
            </ListItem>
          )}

          {/* Reports Section */}
          {(reportsHeaderMatches || filteredReportsItems.length > 0) && (
            <ListItem nested sx={{ mt: 1 }}>
              <Toggler
                defaultExpanded={pathname.startsWith('/admin/reports')}
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton
                    onClick={() => {
                      setOpen(!open);
                      router.push('/admin/reports');
                    }}
                    sx={pathname.startsWith('/admin/reports') ? activeStyle : {}}
                    onMouseEnter={() => setHoveredItem('reports')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <AssessmentIcon
                      sx={{
                        transition: 'all 0.3s ease',
                        transform:
                          hoveredItem === 'reports'
                            ? 'scale(1.1)'
                            : 'scale(1)',
                      }}
                    />
                    <ListItemContent>
                      <Typography level="title-sm" sx={{ fontSize: '1.1rem' }}>
                        Reports
                      </Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition:
                          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, pl: 2, mt: 1 }}>
                  {filteredReportsItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemButton
                        component="a"
                        href={item.href}
                        sx={{
                          pl: 3,
                          borderRadius: '8px',
                          ...(pathname === item.href ? activeStyle : {}),
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <ListItemContent>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: '1rem',
                              transition: 'transform 0.2s ease',
                              transform:
                                hoveredItem === item.id
                                  ? 'translateX(4px)'
                                  : 'translateX(0)',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Toggler>
            </ListItem>
          )}
        </List>
      </Box>
    </Sheet>
  );
}

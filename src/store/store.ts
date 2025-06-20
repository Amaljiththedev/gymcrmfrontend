import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

// Reducers
import authReducer from "./authSlice";
import memberReducer from "@/src/features/members/memberSlice";
import membershipPlanReducer from "@/src/features/membershipPlans/membershipPlanSlice";
import staffReducer from "@/src/features/staff/staffSlice";
import paymentReducer from "@/src/features/payments/paymentSlice";
import invoiceReducer from "@/src/features/invoice/invoiceSlice";
import trainerReducer from "@/src/features/trainers/trainerSlice";
import expenseReducer from "@/src/features/expense/expenseSlice";
import salaryReducer from "@/src/features/salaryslip/staffSalarySlice";
import salarySlipReducer from "@/src/features/salaryslip/staffSalarySlice";
import trainerSalarySlice from "../features/salaryslip/trainerSalarySlice";
import managerReducer from "@/src/features/manager/managerSlice";
import dashboardReducer from "@/src/features/dashboard/dashboardSlice";
import membershipPlanStatsReducer from "@/src/features/reports/MembershipPlanReportSlice";
import enrollmentChartReducer from "@/src/features/reports/enrollmentChartSlice";
import revenueChartReducer from "@/src/features/reports/revenueChartSlice";
import reportsOverviewReducer from "@/src/features/reports/reportsOverviewSlice";
import renewMemberReducer from '@/src/features/membershiprenewal/renewMemberSlice'
import expenseBreakdownReducer from "@/src/features/reports/expenseBreakdownSlice";
import monthlyRevenueReducer from "@/src/features/reports/monthlyRevenueSlice"; // Adjust the path as needed
import membershipGrowthReducer from "@/src/features/reports/membershipGrowthSlice"; // Adjust the path as needed
import planDistributionReducer from "@/src/features/membershipreports/planDistributionSlice"; // Adjust the path as needed
import ReportsOverviewState from "@/src/features/reports/reportsOverviewSlice";
import membershipStatusReducer from "@/src/features/membershipreports/membershipStatusSlice";
import renewalsSignupsReducer from "@/src/features/membershipreports/renewalsSignupsSlice";
import salesQuickStatsReducer from "@/src/features/salesreport/salesQuickStatsSlice"; // Adjust the path as needed
import salesOverTimeReducer from "@/src/features/salesreport/salesOverTimeSlice";
import salesByPlanReducer from "@/src/features/salesreport/salesByPlanSlice"; // Adjust the path as needed
import pendingRenewalsReducer from "@/src/features/salesreport/pendingRenewalsSlice";
import memberQuickStatsSlice  from "@/src/features/memberdemographics/memberQuickStatsSlice";
import genderDistributionReducer from "@/src/features/memberdemographics/genderDistributionSlice"; // Adjust the path as needed
import ageGenderBreakdownReducer from "@/src/features/memberdemographics/ageGenderBreakdownSlice";
import expenseQuickStatsReducer from "@/src/features/expensereports/expenseSummarySlice";
import expenseCategoryReducer from "@/src/features/expensereports/expenseCategorySlice"; // <-- ADD THIS ✅
import expenseTrendsReducer from "@/src/features/expensereports/expenseTrendsSlice"; // ✅ Newly Added





// 🔐 Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist only auth
};

// 🔁 Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  members: memberReducer,
  membershipPlans: membershipPlanReducer,
  staff: staffReducer,
  payment: paymentReducer,
  invoice: invoiceReducer,
  trainers: trainerReducer,
  expense: expenseReducer,
  salary: salaryReducer,
  salarySlip: salarySlipReducer,
  trainerSalarySlice :trainerSalarySlice,
  manager: managerReducer,
  dashboard: dashboardReducer,
  membershipPlanStats: membershipPlanStatsReducer,
  enrollmentChart: enrollmentChartReducer,
  revenueChart: revenueChartReducer,
  reportsOverview: ReportsOverviewState,
  expenseBreakdown: expenseBreakdownReducer,
  monthlyRevenue: monthlyRevenueReducer,
  membershipGrowth: membershipGrowthReducer,
  membershipStatus: membershipStatusReducer,
  renewalsSignups: renewalsSignupsReducer,
  planDistribution: planDistributionReducer,
  salesQuickStats: salesQuickStatsReducer,
  salesOverTime: salesOverTimeReducer,
  salesByPlan: salesByPlanReducer,
  pendingRenewals: pendingRenewalsReducer,
  memberQuickStats: memberQuickStatsSlice,
  genderDistribution: genderDistributionReducer,
  ageGenderBreakdown: ageGenderBreakdownReducer,
  expenseQuickStats: expenseQuickStatsReducer,
  expenseCategory: expenseCategoryReducer,
  expenseTrends: expenseTrendsReducer,
  renewal: renewMemberReducer,


});

// 🎯 Wrap with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🏗️ Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// 🧠 Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🧪 Export persistor for use with PersistGate
export const persistor = persistStore(store);

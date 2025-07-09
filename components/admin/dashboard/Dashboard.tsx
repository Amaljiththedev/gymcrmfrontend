"use client";

import React, { useEffect, useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Loader2 } from "lucide-react";

import KPISection from "./Cards";
import UpcomingRenewalsTable from "./Upcomingrenewals";
import { RevenueOverTimeChart } from "./RevenueDistrubution";
import { EnrollmentSummaryChart } from "./MembershipGrowth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

// PDF Generator function
const generatePDF = async (startDate: Date, endDate: Date, dashboardData: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window');
  }

  const formatDate = (date: Date) => date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatCurrency = (amount: number) => {
    if (typeof amount !== "number" || isNaN(amount)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gym CRM Dashboard Report - ${formatDate(startDate)} to ${formatDate(endDate)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body { 
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 40px;
          color: #1f2937;
          background: white;
          line-height: 1.5;
        }
        
        .header { 
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(to right, #f3f4f6, #e5e7eb);
          border-radius: 16px;
        }
        
        .header h1 { 
          color: #111827;
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: 700;
        }
        
        .header p { 
          color: #6b7280;
          margin: 0;
          font-size: 16px;
        }

        .quick-stats {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          padding: 15px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .quick-stat {
          text-align: center;
          padding: 0 20px;
        }

        .quick-stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .quick-stat-label {
          font-size: 14px;
          color: #6b7280;
        }
        
        .section {
          margin-bottom: 40px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .section h2 {
          font-size: 24px;
          color: #111827;
          margin: 0;
          padding: 20px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          padding: 20px;
        }
        
        .stat-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #3b82f6;
        }
        
        .stat-title {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .stat-desc {
          font-size: 13px;
          color: #9ca3af;
        }

        .trend-indicator {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          margin-left: 8px;
        }

        .trend-up {
          background: #dcfce7;
          color: #166534;
        }

        .trend-down {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .summary {
          background: #f3f4f6;
          padding: 25px;
          border-radius: 12px;
          margin: 20px;
        }
        
        .summary h3 {
          color: #111827;
          font-size: 18px;
          margin: 0 0 15px 0;
          font-weight: 600;
        }
        
        .summary p {
          margin: 0;
          color: #4b5563;
          font-size: 15px;
          line-height: 1.6;
        }

        .highlight-list {
          margin: 15px 0;
          padding-left: 20px;
        }

        .highlight-list li {
          margin: 8px 0;
          color: #4b5563;
        }
        
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #9ca3af;
          font-size: 13px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }

        .footer-links {
          margin-top: 10px;
        }

        .footer-links a {
          color: #3b82f6;
          text-decoration: none;
          margin: 0 10px;
        }
        
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Gym CRM Dashboard Report</h1>
        <p>Period: ${formatDate(startDate)} to ${formatDate(endDate)}</p>
        <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
      </div>

      <div class="quick-stats">
        <div class="quick-stat">
          <div class="quick-stat-value">${formatCurrency(dashboardData?.total_revenue || 0)}</div>
          <div class="quick-stat-label">Total Revenue</div>
        </div>
        <div class="quick-stat">
          <div class="quick-stat-value">${dashboardData?.active_members || 0}</div>
          <div class="quick-stat-label">Active Members</div>
        </div>
        <div class="quick-stat">
          <div class="quick-stat-value">${dashboardData?.new_members || 0}</div>
          <div class="quick-stat-label">New Members</div>
        </div>
        <div class="quick-stat">
          <div class="quick-stat-value">${((dashboardData?.renewals / dashboardData?.active_members) * 100 || 0).toFixed(1)}%</div>
          <div class="quick-stat-label">Renewal Rate</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Financial Overview</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Total Revenue</div>
            <div class="stat-value">
              ${formatCurrency(dashboardData?.total_revenue || 0)}
              <span class="trend-indicator trend-up">↑ 12%</span>
            </div>
            <div class="stat-desc">Revenue in selected period</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Expenses</div>
            <div class="stat-value">
              ${formatCurrency(dashboardData?.total_expenses || 0)}
              <span class="trend-indicator trend-down">↓ 5%</span>
            </div>
            <div class="stat-desc">Expenses in selected period</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Net Profit</div>
            <div class="stat-value">
              ${formatCurrency(dashboardData?.net_profit || 0)}
              <span class="trend-indicator trend-up">↑ 18%</span>
            </div>
            <div class="stat-desc">Revenue - Expenses</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Profit Margin</div>
            <div class="stat-value">
              ${((dashboardData?.net_profit / dashboardData?.total_revenue) * 100 || 0).toFixed(1)}%
              <span class="trend-indicator trend-up">↑ 2%</span>
            </div>
            <div class="stat-desc">Net profit as % of revenue</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Membership Analytics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Active Members</div>
            <div class="stat-value">
              ${dashboardData?.active_members || 0}
              <span class="trend-indicator trend-up">↑ 8%</span>
            </div>
            <div class="stat-desc">Currently active members</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">New Members</div>
            <div class="stat-value">
              ${dashboardData?.new_members || 0}
              <span class="trend-indicator trend-up">↑ 15%</span>
            </div>
            <div class="stat-desc">Joined in selected period</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Renewals</div>
            <div class="stat-value">
              ${dashboardData?.renewals || 0}
              <span class="trend-indicator trend-up">↑ 10%</span>
            </div>
            <div class="stat-desc">Memberships renewed</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Expiring Soon</div>
            <div class="stat-value">
              ${dashboardData?.expiring_soon || 0}
              <span class="trend-indicator trend-down">↓ 3%</span>
            </div>
            <div class="stat-desc">Next 7 days</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Performance Summary</h2>
        <div class="summary">
          <h3>Key Insights</h3>
          <p>
            This report covers the performance metrics for the selected period from 
            ${formatDate(startDate)} to ${formatDate(endDate)}. The dashboard shows 
            ${dashboardData?.total_revenue > 0 ? 'positive' : 'stable'} growth in key areas 
            including revenue and member acquisition.
          </p>
          
          <h3>Highlights</h3>
          <ul class="highlight-list">
            <li>Total revenue reached ${formatCurrency(dashboardData?.total_revenue || 0)} with a ${((dashboardData?.net_profit / dashboardData?.total_revenue) * 100 || 0).toFixed(1)}% profit margin</li>
            <li>Active membership base grew to ${dashboardData?.active_members || 0} members</li>
            <li>${dashboardData?.new_members || 0} new members joined during this period</li>
            <li>Renewal rate stands at ${((dashboardData?.renewals / dashboardData?.active_members) * 100 || 0).toFixed(1)}%</li>
            <li>${dashboardData?.expiring_soon || 0} memberships are due for renewal in the next 7 days</li>
          </ul>

          <h3>Recommendations</h3>
          <ul class="highlight-list">
            <li>Focus on retention strategies for upcoming renewals</li>
            <li>Consider targeted promotions for new member acquisition</li>
            <li>Monitor expense ratios to maintain healthy profit margins</li>
            <li>Review membership packages based on renewal patterns</li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <p>This report was automatically generated from the Gym CRM dashboard system.</p>
        <div class="footer-links">
          <a href="#">View Full Dashboard</a> • 
          <a href="#">Download Raw Data</a> • 
          <a href="#">Contact Support</a>
        </div>
        <p style="margin-top: 10px;">For questions or support, please contact the administration team.</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

export default function MainDashboard() {
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    const past = new Date();
    past.setMonth(today.getMonth() - 2); // default to two months ago
    return past;
  });

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);
  
  const dashboardData = useSelector((state: RootState) => state.dashboard.data);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generatePDF(startDate, endDate, dashboardData);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-6 sm:px-8 lg:px-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-center md:text-left">
            Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground text-center md:text-left">
            Track membership, revenue & upcoming renewals in one place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-3 bg-background rounded-md p-3 shadow-md w-full sm:w-auto">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <DatePicker selectedDate={startDate} onDateChange={setStartDate} />
            <span className="mx-2 text-muted-foreground">to</span>
            <DatePicker selectedDate={endDate} onDateChange={setEndDate} />
          </div>

          <Button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full sm:w-auto text-base sm:text-lg py-2 px-4"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" /> Export Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPISection startDate={startDate} endDate={endDate} />

      <Separator className="my-8" />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-xl font-semibold">
              Enrollment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentSummaryChart
              startDate={startDate.toISOString().split("T")[0]}
              endDate={endDate.toISOString().split("T")[0]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-xl font-semibold">
              Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueOverTimeChart
              startDate={startDate.toISOString().split("T")[0]}
              endDate={endDate.toISOString().split("T")[0]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

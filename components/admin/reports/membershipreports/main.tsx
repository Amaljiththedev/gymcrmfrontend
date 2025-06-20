"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchMembershipStatusCounts } from "@/src/features/membershipreports/membershipStatusSlice";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Users, FileText, AlertCircle, Download, Loader2 } from "lucide-react";

import { MembershipChart } from "./MembershipChart";
import { ActiveExpiredChart } from "./ActiveExpiredChart";
import { RenewalsSignupsChart } from "./RenewalsSignupsChart";
import { PlanDistributionChart } from "./PlanDistributionChart";

export default function MembershipReports() {
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return thirtyDaysAgo;
  });

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { data: stats, loading } = useSelector(
    (state: RootState) => state.membershipStatus
  );

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      const formatDate = (date: Date) => date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const calculatePercentage = (value: number, total: number) => {
        if (!total) return "0%";
        return `${((value / total) * 100).toFixed(1)}%`;
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Membership Report - ${formatDate(startDate)} to ${formatDate(endDate)}</title>
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
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin: 20px 0;
              padding: 15px;
              background: #f9fafb;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            }

            .quick-stat {
              text-align: center;
              padding: 20px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .quick-stat-value {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
            }

            .quick-stat-label {
              font-size: 14px;
              color: #6b7280;
            }

            .quick-stat-percentage {
              font-size: 14px;
              color: #059669;
              margin-top: 4px;
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

            .warning-text {
              color: #d97706;
              font-weight: 500;
            }
            
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #9ca3af;
              font-size: 13px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Membership Report</h1>
            <p>Period: ${formatDate(startDate)} to ${formatDate(endDate)}</p>
            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
          </div>

          <div class="quick-stats">
            <div class="quick-stat">
              <div class="quick-stat-value">${stats?.total ?? 0}</div>
              <div class="quick-stat-label">Total Members</div>
            </div>
            <div class="quick-stat">
              <div class="quick-stat-value">${stats?.active ?? 0}</div>
              <div class="quick-stat-label">Active Members</div>
              <div class="quick-stat-percentage">${calculatePercentage(stats?.active ?? 0, stats?.total ?? 0)} of total</div>
            </div>
            <div class="quick-stat">
              <div class="quick-stat-value">${stats?.expired ?? 0}</div>
              <div class="quick-stat-label">Expired Members</div>
              <div class="quick-stat-percentage">${calculatePercentage(stats?.expired ?? 0, stats?.total ?? 0)} of total</div>
            </div>
            <div class="quick-stat">
              <div class="quick-stat-value warning-text">${stats?.expiring ?? 0}</div>
              <div class="quick-stat-label">Expiring Soon</div>
              <div class="quick-stat-percentage">${calculatePercentage(stats?.expiring ?? 0, stats?.total ?? 0)} of total</div>
            </div>
          </div>
          
          <div class="section">
            <h2>Membership Summary</h2>
            <div class="summary">
              <h3>Key Insights</h3>
              <p>
                This report covers the membership metrics for the selected period from 
                ${formatDate(startDate)} to ${formatDate(endDate)}. The report provides 
                detailed insights into membership status, growth, and retention.
              </p>
              
              <h3>Highlights</h3>
              <ul class="highlight-list">
                <li>Total membership base: ${stats?.total ?? 0} members</li>
                <li>Active members: ${stats?.active ?? 0} (${calculatePercentage(stats?.active ?? 0, stats?.total ?? 0)})</li>
                <li>Expired members: ${stats?.expired ?? 0} (${calculatePercentage(stats?.expired ?? 0, stats?.total ?? 0)})</li>
                <li>Members expiring soon: ${stats?.expiring ?? 0} (${calculatePercentage(stats?.expiring ?? 0, stats?.total ?? 0)})</li>
              </ul>

              <h3>Recommendations</h3>
              <ul class="highlight-list">
                <li>Focus on retention strategies for ${stats?.expiring ?? 0} members with upcoming renewals</li>
                <li>Review and optimize membership plans based on active vs expired ratios</li>
                <li>Implement targeted engagement programs for at-risk members</li>
                <li>Analyze membership growth patterns to optimize acquisition strategies</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>This report was automatically generated from the Gym CRM system.</p>
            <p>For questions or support, please contact the administration team.</p>
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
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    dispatch(fetchMembershipStatusCounts());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Section with Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
          📄 Membership Report
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-background rounded-md p-2 shadow-sm w-full sm:w-auto">
            <DatePicker selectedDate={startDate} onDateChange={setStartDate} />
            <span className="mx-2 text-muted-foreground">to</span>
            <DatePicker selectedDate={endDate} onDateChange={setEndDate} />
          </div>
          <Button className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" /> Generate Report
          </Button>
          <Button 
            onClick={generatePDF}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" /> Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Quick Stats */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📈 Quick Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Members</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              {loading ? "..." : stats?.total ?? 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              {loading ? "..." : stats?.active ?? 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expired Members</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              {loading ? "..." : stats?.expired ?? 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expiring Members</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2 text-yellow-500">
              <AlertCircle className="w-6 h-6" />
              {loading ? "..." : stats?.expiring ?? 0}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts & Insights */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📊 Charts & Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <MembershipChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active vs Expired Members</CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveExpiredChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Renewals vs Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <RenewalsSignupsChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PlanDistributionChart />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

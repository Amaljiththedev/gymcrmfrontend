"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchSalesQuickStats } from "@/src/features/salesreport/salesQuickStatsSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Wallet, FileText, TrendingUp, Download, Loader2 } from "lucide-react";

import { SalesOverTimeChart } from "./SalesOverTimeChart";
import { SalesByPlanChart } from "./SalesByPlanChart";
import { PendingRenewalsChart } from "./PendingRenewalsChart";
import { SalesTransactionsTable } from "./SalesTransactionsTable";

export default function SalesReport() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { data: stats, loading } = useSelector((state: RootState) => state.salesQuickStats);

  const handleGenerateReport = () => {
    if (startDate && endDate) {
      dispatch(
        fetchSalesQuickStats({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        })
      );
    }
  };

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

      const formatCurrency = (amount: number) => {
        if (typeof amount !== "number" || isNaN(amount)) return "₹0";
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(amount);
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sales Report - ${formatDate(startDate)} to ${formatDate(endDate)}</title>
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
            <h1>Sales Report</h1>
            <p>Period: ${formatDate(startDate)} to ${formatDate(endDate)}</p>
            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
          </div>

          <div class="quick-stats">
            <div class="quick-stat">
              <div class="quick-stat-value">${formatCurrency(stats?.total_revenue ?? 0)}</div>
              <div class="quick-stat-label">Total Revenue</div>
            </div>
            <div class="quick-stat">
              <div class="quick-stat-value">${stats?.total_sales ?? 0}</div>
              <div class="quick-stat-label">Total Sales</div>
            </div>
            <div class="quick-stat">
              <div class="quick-stat-value">${formatCurrency(stats?.pending_payments ?? 0)}</div>
              <div class="quick-stat-label">Pending Payments</div>
            </div>
            <div class="quick-stat">
              <div class="quick-stat-value">${stats?.top_selling_plan ?? "N/A"}</div>
              <div class="quick-stat-label">Top Selling Plan</div>
            </div>
          </div>
          
          <div class="section">
            <h2>Sales Summary</h2>
            <div class="summary">
              <h3>Key Insights</h3>
              <p>
                This report covers the sales metrics for the selected period from 
                ${formatDate(startDate)} to ${formatDate(endDate)}. The report shows 
                detailed breakdown of sales performance and revenue generation.
              </p>
              
              <h3>Highlights</h3>
              <ul class="highlight-list">
                <li>Total revenue reached ${formatCurrency(stats?.total_revenue ?? 0)}</li>
                <li>Total sales transactions: ${stats?.total_sales ?? 0}</li>
                <li>Pending payments amount: ${formatCurrency(stats?.pending_payments ?? 0)}</li>
                <li>Top performing plan: ${stats?.top_selling_plan ?? "N/A"}</li>
              </ul>

              <h3>Recommendations</h3>
              <ul class="highlight-list">
                <li>Focus on converting pending payments to improve cash flow</li>
                <li>Analyze top-selling plan performance for potential optimization</li>
                <li>Review sales trends to identify growth opportunities</li>
                <li>Consider targeted promotions for underperforming plans</li>
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
    handleGenerateReport();
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Section with Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
          📄 Sales Report
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-background rounded-md p-2 shadow-sm w-full sm:w-auto">
            <DatePicker selectedDate={startDate} onDateChange={setStartDate} />
            <span className="mx-2 text-muted-foreground">to</span>
            <DatePicker selectedDate={endDate} onDateChange={setEndDate} />
          </div>
          <Button onClick={handleGenerateReport} className="w-full sm:w-auto">
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
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-muted-foreground" />
              {loading ? "..." : `₹${(stats?.total_revenue ?? 0).toLocaleString("en-IN")}`}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-muted-foreground" />
              {loading ? "..." : stats?.total_sales ?? 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2 text-yellow-500">
              <Wallet className="w-6 h-6" />
              {loading ? "..." : `₹${(stats?.pending_payments ?? 0).toLocaleString("en-IN")}`}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2 text-green-500">
              {loading ? "..." : stats?.top_selling_plan ? `🔥 ${stats.top_selling_plan}` : "N/A"}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts & Insights */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📊 Charts & Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesOverTimeChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sales by Membership Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesByPlanChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Renewals Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <PendingRenewalsChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

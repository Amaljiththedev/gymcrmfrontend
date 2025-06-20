"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchMemberQuickStats } from "@/src/features/memberdemographics/memberQuickStatsSlice";
import { fetchAgeGenderBreakdown } from "@/src/features/memberdemographics/ageGenderBreakdownSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Users, Calendar, Download, Loader2 } from "lucide-react";

import { GenderDistributionChart } from "./GenderDistributionChart";
import { AgeGenderBreakdownChart } from "./AgeGenderBreakdownChart";

export default function MembershipDemographics() {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<Date>(thirtyDaysAgo);
  const [endDate, setEndDate] = useState<Date>(today);
  const [isExporting, setIsExporting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { data: stats, loading } = useSelector((state: RootState) => state.memberQuickStats);
  const { data: ageGenderData } = useSelector((state: RootState) => state.ageGenderBreakdown);

  const handleGenerateReport = () => {
    dispatch(fetchMemberQuickStats());
    dispatch(
      fetchAgeGenderBreakdown({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      })
    );
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

      const calculateGenderRatio = () => {
        if (!stats?.male_members || !stats?.female_members) return "N/A";
        const ratio = (stats.male_members / stats.female_members).toFixed(2);
        return `${ratio}:1`;
      };

      const calculateGenderPercentage = (gender: 'male' | 'female') => {
        if (!stats?.total_members) return "0%";
        const count = gender === 'male' ? stats.male_members : stats.female_members;
        return `${((count / stats.total_members) * 100).toFixed(1)}%`;
      };

      const formatAgeBreakdown = () => {
        if (!ageGenderData || ageGenderData.length === 0) return "No age data available";
        if (!stats?.total_members) return "No total members data available";
        
        return ageGenderData.map(item => {
          const percentage = ((item.count / stats.total_members) * 100).toFixed(1);
          return `${item.category}: ${item.count} members (${percentage}%)`;
        }).join('<br>');
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Membership Demographics Report - ${formatDate(startDate)} to ${formatDate(endDate)}</title>
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
              grid-template-columns: repeat(3, 1fr);
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

            .gender-stats {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 20px 0;
            }

            .gender-stat {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .gender-stat.male {
              border-left: 4px solid #3b82f6;
            }

            .gender-stat.female {
              border-left: 4px solid #ef4444;
            }

            .age-breakdown {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              margin: 20px 0;
            }

            .age-breakdown h3 {
              color: #111827;
              font-size: 18px;
              margin: 0 0 15px 0;
              font-weight: 600;
            }

            .age-breakdown-content {
              color: #4b5563;
              font-size: 15px;
              line-height: 1.8;
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
            <h1>Membership Demographics Report</h1>
            <p>Period: ${formatDate(startDate)} to ${formatDate(endDate)}</p>
            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
          </div>

          <div class="quick-stats">
            <div class="quick-stat">
              <div class="quick-stat-value">${stats?.total_members ?? 0}</div>
              <div class="quick-stat-label">Total Members</div>
            </div>
            <div class="quick-stat">
              <div class="quick-stat-value">${stats?.male_members ?? 0}</div>
              <div class="quick-stat-label">Male Members</div>
            </div>
            <div class="quick-stat">
              <div class="quick-stat-value">${stats?.female_members ?? 0}</div>
              <div class="quick-stat-label">Female Members</div>
            </div>
          </div>

          <div class="section">
            <h2>Gender Distribution</h2>
            <div class="gender-stats">
              <div class="gender-stat male">
                <h3>Male Members</h3>
                <div class="quick-stat-value">${stats?.male_members ?? 0}</div>
                <div class="quick-stat-label">${calculateGenderPercentage('male')} of total</div>
              </div>
              <div class="gender-stat female">
                <h3>Female Members</h3>
                <div class="quick-stat-value">${stats?.female_members ?? 0}</div>
                <div class="quick-stat-label">${calculateGenderPercentage('female')} of total</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Age Distribution</h2>
            <div class="age-breakdown">
              <h3>Age Groups</h3>
              <div class="age-breakdown-content">
                ${formatAgeBreakdown()}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Demographic Summary</h2>
            <div class="summary">
              <h3>Key Insights</h3>
              <p>
                This report covers the membership demographics for the selected period from 
                ${formatDate(startDate)} to ${formatDate(endDate)}. The report provides 
                detailed insights into member composition and gender distribution.
              </p>
              
              <h3>Highlights</h3>
              <ul class="highlight-list">
                <li>Total membership base: ${stats?.total_members ?? 0} members</li>
                <li>Gender distribution: ${stats?.male_members ?? 0} male (${calculateGenderPercentage('male')}) and ${stats?.female_members ?? 0} female (${calculateGenderPercentage('female')}) members</li>
                <li>Gender ratio: ${calculateGenderRatio()}</li>
              </ul>

              <h3>Recommendations</h3>
              <ul class="highlight-list">
                <li>Analyze gender distribution to ensure balanced membership growth</li>
                <li>Review age demographics to optimize program offerings</li>
                <li>Develop targeted marketing strategies based on demographic insights</li>
                <li>Consider gender-specific programs to enhance member engagement</li>
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
    // Initial load
    handleGenerateReport();
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Section with Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
          📊 Membership Demographics Report
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-background rounded-md p-2 shadow-sm w-full sm:w-auto">
            <DatePicker selectedDate={startDate} onDateChange={setStartDate} />
            <span className="mx-2 text-muted-foreground">to</span>
            <DatePicker selectedDate={endDate} onDateChange={setEndDate} />
          </div>
          <Button onClick={handleGenerateReport} className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" /> Generate Report
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
          📌 Quick Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Members</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              {loading ? "..." : stats?.total_members ?? 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Male Members</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-blue-400">
              {loading ? "..." : stats?.male_members ?? 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Female Members</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-red-400">
              {loading ? "..." : stats?.female_members ?? 0}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts & Insights */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
          📊 Charts & Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <GenderDistributionChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Age & Gender Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <AgeGenderBreakdownChart />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

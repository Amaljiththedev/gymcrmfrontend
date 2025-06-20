"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchExpenseById } from "@/src/features/expense/expenseSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  DollarSign,
  Tag,
  Database,
  Calendar,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function ExpenseDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentExpense: expense,
    currentLoading: loading,
    currentError: error,
  } = useSelector((state: RootState) => state.expense);

  useEffect(() => {
    if (id) {
      dispatch(fetchExpenseById(Number(id)));
    }
  }, [dispatch, id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
        <p className="text-lg">Loading expense details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen  text-white p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Error Loading Expense</h3>
        <p className="text-red-400 mb-6">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // Not found state
  if (!expense) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Expense Not Found</h3>
        <p className="text-gray-400 mb-6">The requested expense could not be found.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const downloadReceipt = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${expense.id}/download/`,
      "_blank"
    );
  };

  const formattedDate = new Date(expense.date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen bg-gradient-to-b  text-white">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mr-4 hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Expense Details</h1>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-400">ID: #{expense.id}</p>
          <Button
            variant="outline"
            className="border border-red-500/30 hover:bg-red-500/10 hover:border-red-500 transition-all"
            onClick={downloadReceipt}
          >
            <Download className="mr-2 h-4 w-4" /> Download Receipt
          </Button>
        </div>

        {/* Main Card */}
        <Card className="bg-black/50 shadow-xl border border-white/10 backdrop-blur-sm overflow-hidden">
          {/* Card Header with Title */}
          <CardHeader className="border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-500/10">
                <FileText className="h-6 w-6 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {expense.title}
              </CardTitle>
            </div>
          </CardHeader>

          {/* Card Content - Expense Details */}
          <CardContent className="pt-6 space-y-6">
            {/* Amount - Highlighted */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/40 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/10">
                  <DollarSign className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-sm font-medium">Amount</p>
              </div>
              <p className="text-xl font-bold">₹{Number(expense.amount).toLocaleString()}</p>
            </div>
            
            {/* Other Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-800/20 border border-white/5">
                <Tag className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="text-sm font-medium">{expense.category}</p>
                </div>
              </div>
              
              {/* Source */}
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-800/20 border border-white/5">
                <Database className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-400">Source</p>
                  <p className="text-sm font-medium">{expense.expense_source}</p>
                </div>
              </div>
              
              {/* Date */}
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-800/20 border border-white/5">
                <Calendar className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm font-medium">{formattedDate}</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {expense.description && (
              <div className="mt-6 p-4 rounded-lg bg-gray-800/30 border border-white/5">
                <p className="text-sm font-medium mb-2 text-gray-300">Description</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {expense.description}
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-white/10 py-4 bg-white/5">
          <Button
      variant="ghost"
      onClick={() => router.back()}
      className="flex items-center"
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
    </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/src/store/store";

import {
  createExpense,
  fetchExpenseMeta,
} from "@/src/features/expense/expenseSlice";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  DollarSign,
  Calendar,
  FileText,
  Tag,
  MapPin,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------ */
/* Form state shape                                             */
/* ------------------------------------------------------------ */
const initialForm = {
  title: "",
  amount: "",
  category: "",
  description: "",
  date: new Date(), // JS Date object
  expenseSource: "",
};

export default function CreateExpense() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  /* ---------- Redux data ---------- */
  const { categories, sources, metaLoading } = useSelector(
    (s: RootState) => s.expense
  );

  /* ---------- Local state ---------- */
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  /* ------------------------------------------------------------ */
  /* Load selectable choices once                                  */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    dispatch(fetchExpenseMeta());
  }, [dispatch]);

  /* Set defaults after meta arrives */
  useEffect(() => {
    if (categories.length && !form.category) {
      setForm((f) => ({ ...f, category: categories[0].value }));
    }
    if (sources.length && !form.expenseSource) {
      setForm((f) => ({ ...f, expenseSource: sources[0].value }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, sources]);

  /* ------------------------------------------------------------ */
  /* Validation                                                   */
  /* ------------------------------------------------------------ */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.amount || +form.amount <= 0) e.amount = "Amount must be positive";
    if (!form.date) e.date = "Date is required";
    if (!form.category) e.category = "Select a category";
    if (!form.expenseSource) e.expenseSource = "Select a source";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ------------------------------------------------------------ */
  /* Submit                                                       */
  /* ------------------------------------------------------------ */
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await dispatch(
        createExpense({
          title: form.title,
          amount: parseFloat(form.amount).toFixed(2),
          category: form.category,
          description: form.description,
          date: form.date.toISOString().split("T")[0],
          expense_source: form.expenseSource,
        } as any)
      ).unwrap();

      toast.success("Expense logged ✅");
      router.push("/admin/expensemanagement");
    } catch (err: any) {
      toast.error(err.message || "Failed to create expense");
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------ */
  /* JSX                                                          */
  /* ------------------------------------------------------------ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 py-10 px-2">
      <Card className="w-full max-w-2xl bg-black/60 border border-white/10 shadow-2xl backdrop-blur-lg rounded-2xl p-0">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-red-500/10">
              <FileText className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Log New Expense</h2>
              <p className="text-gray-400 mt-1 text-sm">
                Fill in the details to record an expense
              </p>
            </div>
          </div>
          <Separator className="bg-white/10" />
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Expense Info */}
            <div className="space-y-6 border border-white/10 p-6 rounded-xl bg-black/30 shadow-inner">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2 mb-2">
                <Tag className="h-5 w-5 text-red-500" /> Expense Information
              </h3>
              {/* Title & Amount */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="title"
                      className="pl-10 bg-black/40 border-white/20 text-white focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount (₹)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      className="pl-10 bg-black/40 border-white/20 text-white focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
                  )}
                </div>
              </div>
              {/* Category & Source */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select
                      value={form.category}
                      onValueChange={(v) => setForm({ ...form, category: v })}
                    >
                      <SelectTrigger className="pl-10 bg-black/40 border-white/20 text-white focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition" />
                      <SelectContent className="bg-black/80 border-white/10 text-white">
                        {categories.map((c: any) => (
                          <SelectItem key={c.value} value={c.value} className="capitalize">
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1">{errors.category}</p>
                  )}
                </div>
                {/* Source */}
                <div className="space-y-2">
                  <Label className="text-white">Source</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select
                      value={form.expenseSource}
                      onValueChange={(v) => setForm({ ...form, expenseSource: v })}
                    >
                      <SelectTrigger className="pl-10 bg-black/40 border-white/20 text-white focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition" />
                      <SelectContent className="bg-black/80 border-white/10 text-white">
                        {sources.map((s: any) => (
                          <SelectItem key={s.value} value={s.value} className="capitalize">
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.expenseSource && (
                    <p className="text-red-400 text-xs mt-1">{errors.expenseSource}</p>
                  )}
                </div>
              </div>
              {/* Date */}
              <div className="space-y-2">
                <Label className="text-white">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <DatePicker
                    value={form.date}
                    onChange={(date) => setForm({ ...form, date: date! })}
                    className="pl-10 bg-black/40 border-white/20 text-white focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition w-full"
                  />
                </div>
                {errors.date && (
                  <p className="text-red-400 text-xs mt-1">{errors.date}</p>
                )}
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    as="textarea"
                    rows={3}
                    className="pl-10 bg-black/40 border-white/20 text-white focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <CardFooter className="flex justify-end bg-transparent border-t border-white/10 pt-6">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all flex items-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <FileText className="h-5 w-5" />}
                {submitting ? "Logging..." : "Log Expense"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

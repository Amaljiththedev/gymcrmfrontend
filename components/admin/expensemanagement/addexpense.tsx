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
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <Card className="bg-transparent border border-white/10 shadow-md shadow-white/5 p-4">
        <CardContent className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-white">Log New Expense</h2>
            <p className="text-gray-400 mt-1">
              Fill in the details to record an expense
            </p>
          </div>

          <Separator className="bg-white/10" />

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Expense Info */}
            <div className="space-y-6 border border-white/10 p-6 rounded-xl bg-black/20">
              <h3 className="text-white text-lg font-semibold">
                Expense Information
              </h3>

              {/* Title & Amount */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="title"
                      className="pl-10 bg-black/40 border-white/20 text-white"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">
                    Amount (₹)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      className="pl-10 bg-black/40 border-white/20 text-white"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm">{errors.amount}</p>
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
                      disabled={metaLoading}
                      value={form.category}
                      onValueChange={(v) => setForm({ ...form, category: v })}
                    >
                      <SelectTrigger className="pl-10 bg-black/40 border-white/20 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20 text-white">
                        {categories.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category}</p>
                  )}
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <Label className="text-white">Expense Source</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select
                      disabled={metaLoading}
                      value={form.expenseSource}
                      onValueChange={(v) =>
                        setForm({ ...form, expenseSource: v })
                      }
                    >
                      <SelectTrigger className="pl-10 bg-black/40 border-white/20 text-white">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20 text-white">
                        {sources.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.expenseSource && (
                    <p className="text-red-500 text-sm">
                      {errors.expenseSource}
                    </p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-white">Date</Label>
                <div className="relative bg-black/40 border border-white/20 rounded-md">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <div className="pl-10">
                    <DatePicker
                      selectedDate={form.date}
                      onDateChange={(d: Date) => setForm({ ...form, date: d })}
                    />
                  </div>
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-white">Description (optional)</Label>
                <textarea
                  className="w-full min-h-[100px] p-3 bg-black/40 border border-white/20 text-white rounded-md"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <CardFooter className="flex justify-end gap-4 px-0">
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={submitting}
              >
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Expense
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

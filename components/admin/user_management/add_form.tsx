"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { createMember } from "@/src/features/members/memberSlice";
import { fetchMembershipPlans } from "@/src/features/membershipPlans/membershipPlanSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, getYear, getMonth, setYear, setMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced DatePicker component with year and month selection
function DatePickerWithYearSelection({
  field,
  label,
  className,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
  disabledDatesFn,
  placeholder = "Select date",
}: {
  field: any;
  label: string;
  className?: string;
  fromYear?: number;
  toYear?: number;
  disabledDatesFn?: (date: Date) => boolean;
  placeholder?: string;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(
    getYear(field.value || new Date())
  );
  const [currentMonth, setCurrentMonth] = useState(
    getMonth(field.value || new Date())
  );

  // Generate array of years (latest first)
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => toYear - i);
  // List of months for display
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Handle changing the year
  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    if (field.value) {
      const newDate = setYear(field.value, year);
      field.onChange(newDate);
    }
  };

  // Handle changing the month
  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    if (field.value) {
      const newDate = setMonth(field.value, month);
      field.onChange(newDate);
    }
  };

  return (
    <FormItem className={cn("flex flex-col", className)}>
      <FormLabel>{label}</FormLabel>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className="w-full bg-transparent text-white border-gray-700 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, "PPP")
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-800 text-white border-gray-700">
          <div className="flex flex-col p-3 space-y-4">
            {/* Year selector */}
            <div className="flex justify-between items-center px-2">
              <Button
                variant="ghost"
                onClick={() => handleYearChange(currentYear - 1)}
                disabled={currentYear <= fromYear}
                className="h-8 w-8 p-0 hover:bg-gray-700"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Select
                value={currentYear.toString()}
                onValueChange={(value) => handleYearChange(Number(value))}
              >
                <SelectTrigger className="w-28 bg-gray-700 border-gray-600">
                  <SelectValue placeholder={currentYear.toString()} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                onClick={() => handleYearChange(currentYear + 1)}
                disabled={currentYear >= toYear}
                className="h-8 w-8 p-0 hover:bg-gray-700"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            {/* Month selector grid */}
            <div className="grid grid-cols-3 gap-2 px-2">
              {months.map((month, index) => (
                <Button
                  key={month}
                  variant={currentMonth === index ? "default" : "ghost"}
                  className={`h-8 text-xs ${currentMonth === index ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                  onClick={() => handleMonthChange(index)}
                >
                  {month.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={(date) => {
              field.onChange(date);
              setCalendarOpen(false);
            }}
            month={new Date(currentYear, currentMonth)}
            onMonthChange={(date) => {
              setCurrentYear(getYear(date));
              setCurrentMonth(getMonth(date));
            }}
            disabled={disabledDatesFn}
            className="border-t border-gray-700"
            classNames={{
              head_row: "border-b border-gray-700",
              row: "border-b border-gray-700",
              day_today: "bg-gray-700 text-white",
              day_selected: "bg-blue-600 hover:bg-blue-700",
              day_disabled: "text-gray-500 opacity-50 cursor-not-allowed"
            }}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

// Helper function to compute expiry date based on start date and duration in days
const getExpiryDate = (startDate: Date | undefined, durationDays: number): string => {
  if (!startDate) return "";
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + durationDays);
  return expiryDate.toISOString().slice(0, 10);
};

// Form schema validation
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  gender: z.string({ required_error: "Please select a gender" }),
  membershipStart: z.date({
    required_error: "Please select a membership start date",
  }),
  selectedPlan: z.string({ required_error: "Please select a membership plan" }),
  initialPayment: z.string().min(1, { message: "Please enter an initial payment amount" }),
  height: z.string().optional(),
  weight: z.string().optional(),
  dob: z.date().optional(),
});

export default function MemberEnrollmentForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { plans } = useSelector((state: RootState) => state.membershipPlans);
  const [photo, setPhoto] = useState<File | null>(null);

  // Initialize react-hook-form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      selectedPlan: "",
      initialPayment: "",
      height: "",
      weight: "",
    },
  });

  // Watch values for computed fields
  const membershipStart = form.watch("membershipStart");
  const selectedPlan = form.watch("selectedPlan");

  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  // Compute expiry date based on the selected membership start and plan
  const computedExpiryDate = useMemo(() => {
    if (!membershipStart || !selectedPlan) return "";
    const plan = plans.find((p) => String(p.id) === selectedPlan);
    if (!plan) return "";
    return getExpiryDate(membershipStart, plan.duration_days);
  }, [membershipStart, selectedPlan, plans]);

  // Compute duration in months from the plan's duration in days
  const computedDurationMonths = useMemo(() => {
    if (!selectedPlan) return "";
    const plan = plans.find((p) => String(p.id) === selectedPlan);
    if (!plan) return "";
    const months = Math.ceil(plan.duration_days / 30);
    return months.toString();
  }, [selectedPlan, plans]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const memberData = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      gender: values.gender,
      membership_start: values.membershipStart.toISOString(),
      membership_plan: Number(values.selectedPlan),
      amount_paid: Number(values.initialPayment),
      height: values.height ? Number(values.height) : undefined,
      weight: values.weight ? Number(values.weight) : undefined,
      dob: values.dob ? values.dob.toISOString().slice(0, 10) : undefined,
      is_blocked: false,
      photo: photo || undefined,
    };
    
    try {
      await dispatch(createMember(memberData)).unwrap();
      toast.success("Member created successfully! 🎉");
      router.push("/admin/membermanagement");
    } catch (error: any) {
      toast.error("Failed to create member 😢: " + error);
    }
  };

  const handleReset = () => {
    form.reset();
    setPhoto(null);
    toast.info("Form reset");
  };

  const handleCancel = () => {
    if (Object.values(form.getValues()).some(value => value !== "")) {
      if (confirm("Are you sure you want to discard your changes?")) {
        router.push("/admin/usersmanagement");
      }
    } else {
      router.push("/admin/usersmanagement");
    }
  };

  return (
    <Card className="w-full bg-transparent text-white shadow-xl">
      <CardHeader className="bg-transparent">
        <CardTitle className="text-3xl font-bold text-center">Member Enrollment</CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b border-gray-800 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter first name"
                          className="bg-transparent text-white border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter last name"
                          className="bg-transparent text-white border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@mail.com"
                        className="bg-transparent text-white border-gray-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          className="bg-gray-800 text-white border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter address"
                          className="bg-transparent text-white border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-transparent text-white border-gray-700">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Membership Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b border-gray-800 pb-2">Membership Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="membershipStart"
                  render={({ field }) => (
                    <DatePickerWithYearSelection
                      field={field}
                      label="Membership Start"
                      disabledDatesFn={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 2}
                      placeholder="Select start date"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="selectedPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Plan</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent text-white border-gray-700">
                            <SelectValue placeholder="Select Plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 text-white border-gray-700">
                          {plans.map((plan) => (
                            <SelectItem key={plan.id} value={String(plan.id)}>
                              {plan.name} | {plan.duration_days} days | ₹{plan.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Computed Expiry Date</FormLabel>
                  <Input
                    readOnly
                    value={computedExpiryDate}
                    className="bg-transparent text-white border-gray-700"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel>Duration (months)</FormLabel>
                  <Input
                    readOnly
                    value={computedDurationMonths}
                    className="bg-transparent text-white border-gray-700"
                  />
                </FormItem>
              </div>
              <FormField
                control={form.control}
                name="initialPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Payment</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="bg-transparent text-white border-gray-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel htmlFor="photo">Photo</FormLabel>
                <Input
                  id="photo"
                  type="file"
                  onChange={(e) =>
                    setPhoto(e.target.files ? e.target.files[0] : null)
                  }
                  className="bg-transparent text-white border-gray-700"
                />
              </FormItem>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b border-gray-800 pb-2">Health Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 170.00"
                          className="bg-transparent text-white border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 65.00"
                          className="bg-transparent text-white border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <DatePickerWithYearSelection
                    field={field}
                    label="Date of Birth"
                    disabledDatesFn={(date) => date > new Date()}
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                    placeholder="Select birth date"
                  />
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 p-6 bg-transparent">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-t from-destructive to-destructive/85 text-destructive-foreground border border-zinc-950/25 shadow-md shadow-zinc-950/20 ring-1 ring-inset ring-white/20 hover:brightness-110 active:brightness-90"
            >
              Enroll Member
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="w-full h-12 bg-transparent text-white border-gray-600 hover:bg-gray-600 active:bg-gray-500"
            >
              Reset
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

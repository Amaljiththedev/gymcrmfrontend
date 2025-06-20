"use client";

import React, { useState, useMemo } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CreditCard,
  Camera,
  Ruler,
  Weight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  X,
  RotateCcw,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

// Mock data for demonstration
const mockPlans = [
  { id: 1, name: "Basic", duration_days: 30, price: 1500 },
  { id: 2, name: "Premium", duration_days: 90, price: 4000 },
  { id: 3, name: "Annual", duration_days: 365, price: 15000 },
];

// Date utility functions
const formatDate = (date: Date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const getYear = (date: { getFullYear: () => any; }) => date.getFullYear();
const getMonth = (date: { getMonth: () => any; }) => date.getMonth();
const setYear = (date: { setFullYear: (arg0: any) => string | number | Date; }, year: any) => new Date(date.setFullYear(year));
const setMonth = (date: { setMonth: (arg0: any) => string | number | Date; }, month: any) => new Date(date.setMonth(month));

// Enhanced DatePicker component
type DatePickerWithYearSelectionProps = {
  field: {
    value: Date | null;
    onChange?: (value: Date) => void;
  };
  label: string;
  className?: string;
  fromYear?: number;
  toYear?: number;
  disabledDatesFn?: (date: Date) => boolean;
  placeholder?: string;
  icon?: React.ElementType;
};

function DatePickerWithYearSelection({
  field,
  label,
  className,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
  disabledDatesFn,
  placeholder = "Select date",
  icon: Icon = Calendar
}: DatePickerWithYearSelectionProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(
    getYear(field?.value || new Date())
  );
  const [currentMonth, setCurrentMonth] = useState(
    getMonth(field?.value || new Date())
  );

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => toYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    if (field?.value) {
      const newDate = new Date(field.value);
      newDate.setFullYear(year);
      field.onChange?.(newDate);
    }
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    if (field?.value) {
      const newDate = new Date(field.value);
      newDate.setMonth(month);
      field.onChange?.(newDate);
    }
  };

  const handleDateSelect = (day: number | undefined) => {
    const newDate = new Date(currentYear, currentMonth, day);
    field.onChange?.(newDate);
    setCalendarOpen(false);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = field?.value && 
        field.value.getDate() === day && 
        field.value.getMonth() === currentMonth && 
        field.value.getFullYear() === currentYear;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`w-8 h-8 text-sm rounded transition-colors ${
            isSelected 
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-700 text-gray-300'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-400" />
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setCalendarOpen(!calendarOpen)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-left text-white hover:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className={field?.value ? "text-white" : "text-gray-400"}>
              {field?.value ? formatDate(field.value) : placeholder}
            </span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
        </button>
        
        {calendarOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                type="button"
                onClick={() => handleYearChange(currentYear - 1)}
                disabled={currentYear <= fromYear}
                className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <select
                value={currentYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleYearChange(currentYear + 1)}
                disabled={currentYear >= toYear}
                className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {months.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthChange(index)}
                  className={`p-2 text-xs rounded transition-colors ${
                    currentMonth === index 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs text-gray-400 text-center p-1">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
            
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                field?.onChange?.(today);
                setCalendarOpen(false);
              }}
              className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Select Today
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Form field component
type FormFieldProps = {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
};

function FormField({ label, icon: Icon, children, error, required = false }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-400" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// Input component
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ElementType;
};

function Input({ icon: Icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
      <input
        {...props}
        className={`w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 hover:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          Icon ? 'pl-10' : ''
        } ${props.className || ''}`}
      />
    </div>
  );
}

// Select component
type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  icon: React.ElementType;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

function Select({ label, icon: Icon, options, value, onChange, placeholder, error }: SelectProps) {
  return (
    <FormField label={label} icon={Icon} error={error}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white hover:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export default function MemberEnrollmentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    membershipStart: null,
    selectedPlan: "",
    initialPayment: "",
    height: "",
    weight: "",
    dob: null,
  });
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Personal Info", icon: User },
    { title: "Membership", icon: CreditCard },
    { title: "Health Data", icon: Weight }
  ];

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Compute expiry date
  const computedExpiryDate = useMemo(() => {
    if (!formData.membershipStart || !formData.selectedPlan) return "";
    const plan = mockPlans.find(p => String(p.id) === formData.selectedPlan);
    if (!plan) return "";
    const expiryDate = new Date(formData.membershipStart);
    expiryDate.setDate(expiryDate.getDate() + plan.duration_days);
    return formatDate(expiryDate);
  }, [formData.membershipStart, formData.selectedPlan]);

  const computedDurationMonths = useMemo(() => {
    if (!formData.selectedPlan) return "";
    const plan = mockPlans.find(p => String(p.id) === formData.selectedPlan);
    if (!plan) return "";
    return Math.ceil(plan.duration_days / 30).toString();
  }, [formData.selectedPlan]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Validation logic here
    console.log("Form submitted:", formData);
    alert("Member enrolled successfully! 🎉");
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      membershipStart: null,
      selectedPlan: "",
      initialPayment: "",
      height: "",
      weight: "",
      dob: null,
    });
    setPhoto(null);
    setErrors({});
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen  from-black via-slate-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Member Enrollment</h1>
          <p className="text-gray-300">Join our fitness community today</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : 'border-gray-600 text-gray-400'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ml-6 transition-colors ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Step 0: Personal Information */}
            {currentStep === 0 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="First Name" icon={User} required>
                    <Input
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </FormField>
                  
                  <FormField label="Last Name" icon={User} required>
                    <Input
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </FormField>
                </div>

                <FormField label="Email Address" icon={Mail} required>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Phone Number" icon={Phone} required>
                    <Input
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </FormField>

                  <Select
                    label="Gender"
                    icon={User}
                    value={formData.gender}
                    onChange={(value) => handleInputChange('gender', value)}
                    placeholder="Select gender"
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                </div>

                <FormField label="Address" icon={MapPin} required>
                  <Input
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </FormField>
              </div>
            )}

            {/* Step 1: Membership Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Membership Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DatePickerWithYearSelection
                    field={{
                      value: formData.membershipStart,
                      onChange: (value: Date) => handleInputChange('membershipStart', value)
                    }}
                    label="Membership Start Date"
                    icon={Calendar}
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 2}
                    placeholder="Select start date" className={undefined} disabledDatesFn={undefined}                  />

                  <Select
                    label="Membership Plan"
                    icon={CreditCard}
                    value={formData.selectedPlan}
                    onChange={(value) => handleInputChange('selectedPlan', value)}
                    placeholder="Select a plan"
                    options={mockPlans.map(plan => ({
                      value: String(plan.id),
                      label: `${plan.name} - ${plan.duration_days} days - ₹${plan.price}`
                    }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Membership Expiry" icon={CalendarDays}>
                    <Input
                      readOnly
                      value={computedExpiryDate}
                      className="bg-gray-700/50 cursor-not-allowed"
                      placeholder="Auto-calculated"
                    />
                  </FormField>

                  <FormField label="Duration (Months)" icon={Calendar}>
                    <Input
                      readOnly
                      value={computedDurationMonths}
                      className="bg-gray-700/50 cursor-not-allowed"
                      placeholder="Auto-calculated"
                    />
                  </FormField>
                </div>

                <FormField label="Initial Payment" icon={CreditCard} required>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={formData.initialPayment}
                    onChange={(e) => handleInputChange('initialPayment', e.target.value)}
                  />
                </FormField>

                <FormField label="Profile Photo" icon={Camera}>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-colors shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                      Choose Photo
                    </label>
                    {photo && (
                      <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-700/50 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {photo.name}
                      </div>
                    )}
                  </div>
                </FormField>
              </div>
            )}

            {/* Step 2: Health Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Weight className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Health Information</h2>
                  <span className="text-sm text-gray-400">(Optional)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Height (cm)" icon={Ruler}>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 170.5"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                    />
                  </FormField>

                  <FormField label="Weight (kg)" icon={Weight}>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 65.5"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </FormField>
                </div>

                <DatePickerWithYearSelection
                    field={{
                    value: formData.dob,
                    onChange: (value: Date) => handleInputChange('dob', value)
                  }}
                  label="Date of Birth"
                  icon={CalendarDays}
                  fromYear={1920}
                  toYear={new Date().getFullYear()}
                  placeholder="Select birth date"
                  className=""
                  disabledDatesFn={() => false}
                />

                {/* BMI Calculator */}
                {formData.height && formData.weight && (
                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">BMI Calculation</h3>
                    <p className="text-gray-300">
                      BMI: {((parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2)).toFixed(1))}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-700">
              <div className="flex space-x-3">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg transform hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Enroll Member
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Summary */}
        {currentStep === 2 && (
          <div className="mt-6 bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Enrollment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Email:</span> {formData.email}
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Plan:</span> {
                  formData.selectedPlan ? 
                  mockPlans.find(p => String(p.id) === formData.selectedPlan)?.name : 
                  'Not selected'
                }
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Payment:</span> ₹{formData.initialPayment || '0'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define props interface
interface DatePickerWithRangeProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  setFromDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setToDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  className?: string;
}

export function DatePickerWithRange({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  className,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fromDate || new Date(2022, 0, 20),
    to: toDate || addDays(new Date(2022, 0, 20), 20),
  });

  // Update parent state when date changes
  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    setFromDate(selectedDate?.from);
    setToDate(selectedDate?.to);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

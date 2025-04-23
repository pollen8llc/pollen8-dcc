
import * as React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

interface DateSelectProps {
  monthValue?: string;
  onMonthChange?: (month: string) => void;
  dayValue?: string;
  onDayChange?: (day: string) => void;
  yearValue?: string;
  onYearChange?: (year: string) => void;
  disabled?: boolean;
}

const MONTHS = [
  {value: "01", label: "January"},
  {value: "02", label: "February"},
  {value: "03", label: "March"},
  {value: "04", label: "April"},
  {value: "05", label: "May"},
  {value: "06", label: "June"},
  {value: "07", label: "July"},
  {value: "08", label: "August"},
  {value: "09", label: "September"},
  {value: "10", label: "October"},
  {value: "11", label: "November"},
  {value: "12", label: "December"}
];

export function DateSelect({ 
  monthValue, 
  onMonthChange,
  dayValue, 
  onDayChange,
  yearValue, 
  onYearChange,
  disabled = false
}: DateSelectProps) {
  // Function to generate days based on month and year
  const getDaysInMonth = (month: string, year: string): number => {
    if (!month || !year) return 31;
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // February special case
    if (monthNum === 2) {
      // Check for leap year
      if ((yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0) {
        return 29;
      }
      return 28;
    }
    
    // Months with 30 days
    if ([4, 6, 9, 11].includes(monthNum)) {
      return 30;
    }
    
    // All other months have 31 days
    return 31;
  };

  // Generate array of days based on selected month/year
  const days = React.useMemo(() => {
    const daysInMonth = getDaysInMonth(monthValue || "", yearValue || "");
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return { value: day, label: day };
    });
  }, [monthValue, yearValue]);

  // Generate years from 2000 to current year + 5
  const currentYear = new Date().getFullYear();
  const years = React.useMemo(() => {
    return Array.from({ length: currentYear - 1999 + 5 }, (_, i) => {
      const year = (2000 + i).toString();
      return { value: year, label: year };
    });
  }, [currentYear]);

  return (
    <div className="flex gap-2">
      <div className="w-1/3">
        <FormControl>
          <Select 
            value={monthValue} 
            onValueChange={onMonthChange} 
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      
      <div className="w-1/3">
        <FormControl>
          <Select 
            value={dayValue} 
            onValueChange={onDayChange} 
            disabled={disabled || !monthValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map(day => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      
      <div className="w-1/3">
        <FormControl>
          <Select 
            value={yearValue} 
            onValueChange={onYearChange} 
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

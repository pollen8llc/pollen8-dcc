
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormControl } from "@/components/ui/form"

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  className?: string
  disabled?: boolean
}

export function DatePicker({ value, onChange, className, disabled = false }: DatePickerProps) {
  // Detect if we're inside a form context
  const formFieldContext = React.useContext(
    // @ts-ignore - This context might not exist, which is fine
    React.createContext({}, undefined)
  )
  
  // Determine if we're inside a form context
  const isInsideForm = formFieldContext !== undefined && 
    Object.keys(formFieldContext).length > 0 &&
    'name' in formFieldContext

  // Custom handler to ensure the date is properly propagated
  const handleDateSelect = (date?: Date) => {
    console.log("DatePicker handleDateSelect called with:", date);
    if (onChange) {
      onChange(date);
      console.log("DatePicker onChange called with:", date);
    }
  };

  // Create the button element with disabled state
  const buttonElement = (
    <Button
      variant={"outline"}
      disabled={disabled}
      className={cn(
        "w-full pl-3 text-left font-normal",
        !value && "text-muted-foreground",
        className
      )}
    >
      {value ? (
        format(value, "PPP")
      ) : (
        <span>Select a date</span>
      )}
      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
    </Button>
  )

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        {isInsideForm ? (
          <FormControl>{buttonElement}</FormControl>
        ) : (
          buttonElement
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}

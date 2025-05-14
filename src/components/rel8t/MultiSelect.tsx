
import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    onChange(updatedValues);
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter((item) => item !== value));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex flex-wrap min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        onClick={toggle}
      >
        {selectedValues.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return option ? (
                <span
                  key={value}
                  className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs flex items-center"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(value);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}
        <div className="ml-auto flex items-center self-center">
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-lg">
          <div className="p-1">
            {options.length === 0 ? (
              <div className="py-2 px-2 text-sm text-center text-muted-foreground">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                    selectedValues.includes(option.value) ? "bg-accent/50" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="mr-2 h-4 w-4 flex items-center justify-center">
                    {selectedValues.includes(option.value) && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </div>
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

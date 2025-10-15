import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Loc8DialogTriggerProps {
  value?: string[];
  placeholder?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Loc8DialogTrigger = ({
  value = [],
  placeholder = "Select location",
  disabled = false,
  onClick,
  className = ""
}: Loc8DialogTriggerProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className={`w-full justify-start text-left font-normal ${
        !value.length && "text-muted-foreground"
      } ${className}`}
    >
      <MapPin className="mr-2 h-4 w-4 shrink-0" />
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-1 flex-1">
          {value.map((city) => (
            <Badge key={city} variant="secondary" className="text-xs">
              {city}
            </Badge>
          ))}
        </div>
      ) : (
        <span>{placeholder}</span>
      )}
    </Button>
  );
};

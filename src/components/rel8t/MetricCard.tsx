
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type MetricCardColor = "default" | "success" | "warning" | "danger";

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: MetricCardColor;
  progress?: number;
  isLoading?: boolean;
  onActionClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  color = "default",
  progress,
  isLoading = false,
  onActionClick
}) => {
  // Updated color classes for the dark theme
  const colorClasses = {
    default: "border-l-4 border-l-[#00eada]",
    success: "border-l-4 border-l-green-500",
    warning: "border-l-4 border-l-amber-500",
    danger: "border-l-4 border-l-red-500",
  };

  const iconColorClasses = {
    default: "text-[#00eada]",
    success: "text-green-500",
    warning: "text-amber-500",
    danger: "text-red-500",
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-default transition-all h-[160px]",
        colorClasses[color],
        onActionClick && "hover:shadow-md cursor-pointer"
      )}
      onClick={onActionClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline">
              <h2 className="text-3xl font-bold">
                {isLoading ? 
                  <div className="h-8 w-8 rounded-full border-2 border-[#00eada]/30 border-t-[#00eada] animate-spin" /> : 
                  value
                }
              </h2>
              {!isLoading && description && (
                <p className="ml-2 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          {icon && (
            <div className={cn("p-2 rounded-full bg-card/80", iconColorClasses[color])}>
              {icon}
            </div>
          )}
        </div>
        
        {typeof progress === 'number' && (
          <div className="mt-4">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full", 
                  progress >= 75 ? "bg-green-500" : 
                  progress >= 40 ? "bg-amber-500" : 
                  "bg-red-500"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

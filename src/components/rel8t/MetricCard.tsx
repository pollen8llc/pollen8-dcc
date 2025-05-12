
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
  const colorClasses = {
    default: "from-blue-100 to-blue-50 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/20 dark:border-blue-900",
    success: "from-green-100 to-green-50 border-green-200 dark:from-green-950/50 dark:to-green-900/20 dark:border-green-900",
    warning: "from-amber-100 to-amber-50 border-amber-200 dark:from-amber-950/50 dark:to-amber-900/20 dark:border-amber-900",
    danger: "from-red-100 to-red-50 border-red-200 dark:from-red-950/50 dark:to-red-900/20 dark:border-red-900",
  };

  const iconColorClasses = {
    default: "text-blue-600 dark:text-blue-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
  };

  return (
    <Card 
      className={cn(
        "bg-gradient-to-br border overflow-hidden cursor-default transition-all",
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
                  <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /> : 
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
            <div className={cn("p-2 rounded-full bg-background/80", iconColorClasses[color])}>
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

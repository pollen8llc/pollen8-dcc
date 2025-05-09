
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  progress?: number;
  color?: "default" | "success" | "warning" | "danger";
  isLoading?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  progress,
  color = "default",
  isLoading = false,
  className,
}) => {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      case "danger":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-primary";
    }
  };

  const getProgressColor = () => {
    switch (color) {
      case "success":
        return "bg-green-600 dark:bg-green-400";
      case "warning":
        return "bg-amber-600 dark:bg-amber-400";
      case "danger":
        return "bg-red-600 dark:bg-red-400";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardContent className="p-6 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={cn("transition-transform", getColorClasses())}>
            {icon}
          </div>
        </div>

        <div className="flex space-x-2 items-end">
          {isLoading ? (
            <div className="h-9 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <span className="text-3xl font-semibold tracking-tight">
              {value}
            </span>
          )}
          {description && (
            <span className="text-sm text-muted-foreground pb-1">
              {description}
            </span>
          )}
        </div>

        {typeof progress === "number" && (
          <Progress
            value={progress}
            className="h-1.5 w-full bg-muted"
            indicatorClassName={cn(getProgressColor())}
          />
        )}
      </CardContent>
    </Card>
  );
};

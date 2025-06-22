
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  accentColor?: string;
  trailing?: React.ReactNode;
  change?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  accentColor,
  trailing,
  change,
}) => (
  <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-[#00eada]/20 transition-all duration-300">
    <CardContent className="p-6 flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        {icon && (
          <span
            className={`rounded-full p-2 ${accentColor ?? "bg-[#00eada]/20"}`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between flex-1">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        <div className="flex flex-col items-end gap-1">
          {change && (
            <span className={`text-sm font-medium ${
              change.startsWith('+') ? 'text-green-600' : 
              change.startsWith('-') ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </span>
          )}
          {trailing}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatsCard;

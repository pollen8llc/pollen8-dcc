
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  accentColor?: string;
  trailing?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  accentColor,
  trailing,
}) => (
  <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-[#00eada]/20 transition-all duration-300">
    <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</span>
        {icon && (
          <span
            className={`rounded-full p-1.5 sm:p-2 ${accentColor ?? "bg-[#00eada]/20"}`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between flex-1">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{value}</span>
        {trailing}
      </div>
    </CardContent>
  </Card>
);

export default StatsCard;

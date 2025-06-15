
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
  <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl hover:shadow-[#00eada]/20 transition-all duration-150">
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
        {trailing}
      </div>
    </CardContent>
  </Card>
);

export default StatsCard;

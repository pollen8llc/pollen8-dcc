
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface EnhancedStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    period?: string;
  };
  icon?: React.ReactNode;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function EnhancedStatsCard({
  title,
  value,
  change,
  icon,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  size = 'md'
}: EnhancedStatsCardProps) {
  const variantStyles = {
    default: 'bg-white/60 border-gray-200/50 hover:border-[#00eada]/30',
    success: 'bg-green-50/60 border-green-200/50 hover:border-green-300/50',
    warning: 'bg-yellow-50/60 border-yellow-200/50 hover:border-yellow-300/50',
    danger: 'bg-red-50/60 border-red-200/50 hover:border-red-300/50'
  };

  const sizeStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const getTrendIcon = () => {
    if (!change) return null;
    
    return change.trend === 'up' ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : change.trend === 'down' ? (
      <TrendingDown className="h-3 w-3 text-red-600" />
    ) : null;
  };

  const getTrendColor = () => {
    if (!change) return 'text-gray-600';
    
    return change.trend === 'up' 
      ? 'text-green-600' 
      : change.trend === 'down' 
      ? 'text-red-600' 
      : 'text-gray-600';
  };

  return (
    <Card className={`backdrop-blur-xl border transition-all duration-300 hover:shadow-lg hover:shadow-[#00eada]/10 ${variantStyles[variant]}`}>
      <CardContent className={`${sizeStyles[size]} space-y-3`}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                {value}
              </span>
              {change && (
                <div className={`flex items-center space-x-1 text-xs font-medium ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span>{change.value}</span>
                  {change.period && (
                    <span className="text-gray-500">vs {change.period}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {icon && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00eada]/20 to-[#00c4b8]/20 flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        )}

        {/* Action */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="text-sm font-medium text-[#00eada] hover:text-[#00c4b8] transition-colors"
          >
            {actionLabel} →
          </button>
        )}
      </CardContent>
    </Card>
  );
}

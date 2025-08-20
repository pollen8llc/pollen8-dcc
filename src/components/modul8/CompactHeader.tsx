
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BackButton } from "@/components/shared/BackButton";

interface CompactHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

const CompactHeader: React.FC<CompactHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBack,
  backLabel = "Back",
  actions,
  className = ""
}) => {
  return (
    <div className={`flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 ${className}`}>
      {/* Top row with title and back button */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
        
        {showBackButton && onBack && (
          <BackButton
            onClick={onBack}
            label={backLabel}
            className="shrink-0 border-[#00eada]/30 hover:border-[#00eada] hover:bg-[#00eada]/10 transition-all duration-200 hover:shadow-lg hover:shadow-[#00eada]/20"
          />
        )}
      </div>
      
      {/* Actions row */}
      {actions && (
        <div className="flex items-center justify-end gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default CompactHeader;

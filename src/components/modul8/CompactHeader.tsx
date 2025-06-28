
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {showBackButton && onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-sm shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
        )}
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
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default CompactHeader;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  label?: string;
  shortLabel?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const BackButton: React.FC<BackButtonProps> = ({
  to,
  onClick,
  label = "Back to Dashboard",
  shortLabel = "Back",
  size = "sm",
  variant = "outline",
  className,
  icon: Icon = ArrowLeft,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn(
        "flex items-center gap-2",
        variant === "outline" && "border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{shortLabel}</span>
    </Button>
  );
};
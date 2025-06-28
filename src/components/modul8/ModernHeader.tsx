
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Users, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModernHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<any>;
    variant?: 'default' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<any>;
  };
  showLogo?: boolean;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  showLogo = true
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
          <div className="flex flex-col space-y-6 sm:space-y-8">
            
            {/* Logo and Brand Section */}
            {showLogo && (
              <div className="flex items-center justify-center sm:justify-start">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-2xl bg-gradient-to-br from-[#00eada] to-[#00b8a8] flex items-center justify-center shadow-xl shadow-[#00eada]/25">
                    <Building2 className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      MODUL-8
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium mt-1">
                      {subtitle}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Section */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-6 lg:space-y-0 lg:space-x-8">
              
              {/* Title and Description */}
              <div className="text-center sm:text-left flex-1 max-w-3xl">
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground leading-tight">
                  {title}
                </h2>
                {description && (
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mt-3 sm:mt-4 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              {(primaryAction || secondaryAction) && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 min-w-fit">
                  {secondaryAction && (
                    <Button
                      onClick={secondaryAction.onClick}
                      variant="outline"
                      size="lg"
                      className="flex items-center justify-center gap-3 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 text-base font-semibold px-6 py-3 h-auto"
                    >
                      {secondaryAction.icon && <secondaryAction.icon className="h-5 w-5" />}
                      <span className="hidden sm:inline">{secondaryAction.label}</span>
                      <span className="sm:hidden">{secondaryAction.label.split(' ')[0]}</span>
                    </Button>
                  )}
                  
                  {primaryAction && (
                    <Button
                      onClick={primaryAction.onClick}
                      variant={primaryAction.variant || 'default'}
                      size="lg"
                      className="bg-gradient-to-r from-[#00eada] to-[#00b8a8] hover:from-[#00b8a8] hover:to-[#008f82] text-white font-bold shadow-xl shadow-[#00eada]/25 hover:shadow-2xl hover:shadow-[#00eada]/40 transition-all duration-300 transform hover:scale-105 text-base px-8 py-3 h-auto"
                    >
                      {primaryAction.icon && <primaryAction.icon className="h-5 w-5 mr-3" />}
                      {primaryAction.label}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

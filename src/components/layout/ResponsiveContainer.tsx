
import React from 'react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  fullWidth = false
}) => {
  const { containerClass, isMobile } = useResponsiveLayout();

  return (
    <div className={cn(
      fullWidth ? 'w-full px-2 sm:px-4 lg:px-6' : containerClass,
      isMobile ? 'min-h-screen' : '',
      className
    )}>
      {children}
    </div>
  );
};

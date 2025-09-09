interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo = ({ 
  variant = 'light', 
  size = 'md', 
  showText = true, 
  className = "" 
}: LogoProps) => {
  const sizeClasses = {
    sm: showText ? "h-8" : "h-6 w-6",
    md: showText ? "h-10" : "h-8 w-8", 
    lg: showText ? "h-12" : "h-10 w-10"
  };

  const iconSize = {
    sm: 24,
    md: 32,
    lg: 40
  };

  const textColor = variant === 'light' ? 'text-foreground' : 'text-white';
  const iconColor = variant === 'light' ? 'text-primary' : 'text-white';

  return (
    <div className={`flex items-center gap-3 ${sizeClasses[size]} ${className}`}>
      {/* Logo Icon - Geometric Shrimp in Circle */}
      <div className={`relative flex-shrink-0 ${sizeClasses[size].split(' ')[1] || 'w-10'}`}>
        <svg
          width={iconSize[size]}
          height={iconSize[size]}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={iconColor}
        >
          {/* Outer Circle with Gradient */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#shrimpGradient)"
            stroke="currentColor"
            strokeWidth="2"
          />
          
          {/* Stylized Shrimp */}
          <path
            d="M12 20c0-3 2-5.5 4.5-6.5C18 12.5 19.5 12 21 12c2.5 0 5 1.5 6.5 3.5C29 17 30 19 30 21c0 2-.5 4-2 5.5-1.5 1.5-3.5 2-5.5 2-1.5 0-3-1-3.5-2"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Shrimp Details */}
          <circle cx="18.5" cy="17" r="1.5" fill="white" />
          <path
            d="M15 19h2M14.5 21h1.5M14 23h1.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M26 15l2.5-1M27 17l3-.5M27.5 19l2.5-.5M27 21l2.5.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="shrimpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(217 91% 60%)" />
              <stop offset="100%" stopColor="hsl(142 76% 36%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold text-lg ${textColor}`}>
            Meu Viveiro
          </span>
          <span className={`text-xs font-medium ${variant === 'light' ? 'text-muted-foreground' : 'text-white/70'}`}>
            Carcinicultura
          </span>
        </div>
      )}
    </div>
  );
};

// Compact version for sidebar
export const LogoIcon = ({ variant = 'light', className = "" }: Pick<LogoProps, 'variant' | 'className'>) => {
  return <Logo variant={variant} size="sm" showText={false} className={className} />;
};
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
    lg: showText ? "h-16" : "h-12 w-12"
  };

  const iconSize = {
    sm: 24,
    md: 32,
    lg: 48
  };

  const textColor = variant === 'light' ? 'text-foreground' : 'text-white';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Modern Circular Logo - Professional Aquaculture Design */}
      <div className={`relative flex-shrink-0 ${sizeClasses[size].split(' ')[1] || 'w-12'}`}>
        <svg
          width={iconSize[size]}
          height={iconSize[size]}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Teal Circle Background */}
          <circle
            cx="40"
            cy="40"
            r="40"
            fill="#0E7490"
          />
          
          {/* Inner Water Waves Pattern */}
          <path
            d="M8 65c8-4 16-2 24-6s16-2 24-6 16-2 24-6"
            stroke="#0891b2"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M8 70c8-3 16-1 24-4s16-1 24-4 16-1 24-4"
            stroke="#0891b2"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.2"
          />
          
          {/* Orange Shrimp Icon - Modern Minimalist */}
          <g transform="translate(25, 25)">
            {/* Shrimp Body */}
            <path
              d="M8 15c0-4 2-7 5-8.5C15 5.5 17 5 19 5c4 0 8 2.5 10 6s2 8-1 11c-2 2-5 2.5-8 2.5-3 0-6-2-7-4.5"
              fill="#F97316"
              stroke="none"
            />
            
            {/* Shrimp Tail Segments */}
            <path
              d="M4 16c1-1 3-1 4 0M3 18c1-1 2.5-1 3.5 0M2.5 20c1-1 2-1 3 0"
              stroke="#F97316"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Shrimp Eye */}
            <circle cx="15" cy="12" r="1.5" fill="white" />
            <circle cx="15" cy="12" r="0.6" fill="#0E7490" />
            
            {/* Antennae */}
            <path
              d="M25 8l4-2M26 10l4.5-1M26.5 12l4-.5M26 14l4 .5"
              stroke="#F97316"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
          
          {/* Subtle Water Bubbles */}
          <circle cx="15" cy="20" r="1.5" fill="white" opacity="0.4" />
          <circle cx="65" cy="55" r="1" fill="white" opacity="0.3" />
          <circle cx="20" cy="60" r="0.8" fill="white" opacity="0.2" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-poppins font-bold ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-base'} ${textColor}`}>
            MEU VIVEIRO
          </span>
          <span className={`${size === 'lg' ? 'text-sm' : 'text-xs'} font-medium ${variant === 'light' ? 'text-muted-foreground' : 'text-white/70'}`}>
            Gestão inteligente para carcinicultura
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
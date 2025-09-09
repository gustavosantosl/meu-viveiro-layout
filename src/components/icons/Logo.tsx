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
          {/* Aquatic Circle Background */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#aquaGradient)"
            stroke="currentColor"
            strokeWidth="1"
          />
          
          {/* Stylized Shrimp - More aquatic design */}
          <path
            d="M11 20c0-3.5 2.5-6.5 5.5-7.5C18 11.5 19.5 11 21 11c3 0 6 2 7.5 4.5C30 17.5 31 19.5 31 21.5c0 2.5-1 5-2.5 6.5-1.5 1.5-4 2.5-6 2.5-2 0-3.5-1.5-4-3"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Shrimp Eye */}
          <circle cx="18" cy="16.5" r="1.8" fill="white" />
          <circle cx="18" cy="16.5" r="0.8" fill="#0E7490" />
          
          {/* Shrimp Segments */}
          <path
            d="M14.5 19h2.5M14 21h2M13.5 23h2"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          
          {/* Antennae */}
          <path
            d="M26.5 14l3-1.5M27.5 16l3.5-.8M28 18l3-.5M27.5 20l3 .5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Water bubbles effect */}
          <circle cx="13" cy="14" r="1" fill="white" opacity="0.6" />
          <circle cx="31" cy="25" r="0.8" fill="white" opacity="0.4" />
          
          {/* Aquatic Gradient Definition */}
          <defs>
            <linearGradient id="aquaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(188 94% 29%)" />
              <stop offset="50%" stopColor="hsl(188 94% 35%)" />
              <stop offset="100%" stopColor="hsl(142 84% 44%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-poppins font-bold text-lg ${textColor}`}>
            Meu Viveiro
          </span>
          <span className={`text-xs font-medium ${variant === 'light' ? 'text-muted-foreground' : 'text-white/70'}`}>
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
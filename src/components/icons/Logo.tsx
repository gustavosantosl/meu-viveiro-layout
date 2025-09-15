import shrimpLogo from '@/assets/shrimp-logo.png';

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

  const logoSize = {
    sm: 32,
    md: 40,
    lg: 64
  };

  const textColor = variant === 'light' ? 'text-foreground' : 'text-white';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* New Shrimp Logo */}
      <div className="relative flex-shrink-0">
        <img 
          src={shrimpLogo} 
          alt="Shrimp Logo" 
          className={`object-contain ${showText ? sizeClasses[size] : `h-${logoSize[size]/4} w-${logoSize[size]/4}`}`}
          style={{ 
            width: showText ? undefined : logoSize[size],
            height: logoSize[size],
            filter: variant === 'dark' ? 'brightness(0) invert(1)' : undefined
          }}
        />
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
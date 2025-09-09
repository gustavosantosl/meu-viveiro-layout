interface ShrimpIconProps {
  className?: string;
  size?: number;
}

export const ShrimpIcon = ({ className = "", size = 20 }: ShrimpIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 12c0-2.5 1.5-4.5 3.5-5.5C8 5.5 9.5 5 11 5c2 0 4 1 5.5 2.5C18 9 19 11 19 13c0 1.5-.5 3-1.5 4-1 1-2.5 1.5-4 1.5-1 0-2-.5-2.5-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 9.5c.5-.5 1.5-.5 2 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 11.5h1.5M6.5 13.5h1M6 15.5h1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="9.5"
        cy="10.5"
        r="1"
        fill="currentColor"
      />
      <path
        d="M16 8l2-1M17 10l2.5-.5M17.5 12l2-.5M17 14l2 .5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
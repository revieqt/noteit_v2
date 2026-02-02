import React, { ReactNode } from "react";

interface GlassmorphicButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  hoverTint?: string;
  className?: string;
}

const GlassmorphicButton: React.FC<GlassmorphicButtonProps> = ({
  children,
  href,
  onClick,
  hoverTint = "bg-white/40",
  className = "",
}) => {
  const baseClasses = `
    text-white
    bg-white/30
    backdrop-blur-md
    border border-white/20
    focus:outline-none focus:ring-4 focus:ring-white/30
    font-medium rounded-full text-sm px-4 py-3 text-center leading-5 inline-block
    transition-colors duration-200
    ${className}
  `;

  const hoverClass = `${hoverTint} hover:bg-opacity-60`;

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${hoverClass}`}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${hoverClass}`}>
      {children}
    </button>
  );
};

export default GlassmorphicButton;
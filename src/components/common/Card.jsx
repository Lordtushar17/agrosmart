// src/components/common/Card.jsx
import React from "react";

/**
 * Reusable Card wrapper
 * - title, subtitle optional
 * - supports `variant="base"` (default) or `variant="glass"`
 * - hover + shadow effect built-in for base
 */
export default function Card({ 
  title, 
  subtitle, 
  children, 
  className = "", 
  variant = "base" 
}) {
  const baseClasses =
    "card-base bg-white rounded-lg border border-black shadow-sm p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-1.05 hover:scale-[1.02]";
  const glassClasses = "card-glass p-4 border border-black transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.05]";

  return (
    <div className={`${variant === "glass" ? glassClasses : baseClasses} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-2">
          {title && <div className="text-sm font-medium text-gray-700">{title}</div>}
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

import React from "react";
import Link from "next/link";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
};

export default function BackToDashboard({ className = "", children, ariaLabel = "Kembali ke Dashboard", ...rest }: Props) {
  // Prevent external `style` prop from overriding our standardized appearance.
  const { style: _ignoreStyle, ...anchorRest } = rest as any;

  const defaultClass = "inline-flex items-center gap-2 rounded-lg border transition-all font-semibold";
  const styleDefaults: React.CSSProperties = {
    padding: "0.375rem 0.75rem", // px-3 py-1.5
    fontSize: "0.875rem", // text-sm
    background: "var(--bg-800)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  return (
    <Link
      href="/dashboard"
      aria-label={ariaLabel}
      className={`${defaultClass} ${className}`}
      style={styleDefaults}
      {...anchorRest}
    >
      {!children && (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      )}
      {children ?? "Kembali ke Dashboard"}
    </Link>
  );
}

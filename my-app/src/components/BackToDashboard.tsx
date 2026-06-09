import React from "react";
import Link from "next/link";

type Props = {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: React.ReactNode;
  ariaLabel?: string;
};

export default function BackToDashboard({ className = "", onClick, children, ariaLabel = "Kembali ke Dashboard" }: Props) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-semibold ${className}`}
    >
      {!children && (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      )}
      {children ?? "Kembali ke Dashboard"}
    </Link>
  );
}

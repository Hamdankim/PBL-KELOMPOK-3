import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Mencegah background scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Konten Modal */}
      <div 
        className="relative w-full max-w-md p-5 sm:p-6 shadow-2xl rounded-2xl border"
        style={{ 
          background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,244,246,0.96))",
          borderColor: "rgba(148, 163, 184, 0.35)",
          color: "#0f172a",
          zIndex: 51,
          animation: "modalFadeIn 0.2s ease-out forwards",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)"
        }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between mb-5 border-b pb-3" style={{ borderColor: 'rgba(148, 163, 184, 0.28)' }}>
          <h2 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Exo 2', sans-serif", color: '#0f172a' }}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors focus:outline-none"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.background = 'rgba(148,163,184,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        {/* Body Modal */}
        <div className="mt-2 text-sm sm:text-base" style={{ color: '#334155' }}>
          {children}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </div>
  );
}

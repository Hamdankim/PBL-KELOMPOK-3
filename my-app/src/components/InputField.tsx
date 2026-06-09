import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  info: string;
  description: string;
  min: number;
  max: number;
  className?: string;
  textColor?: string;
  inputClass?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  icon,
  info,
  description,
  min,
  max,
  className = "",
  textColor = "text-gray-900",
  inputClass = "",
}) => (
  <div className={`flex items-center gap-3 rounded-lg px-4 py-3 border flex-1 ${className}`}>
    {icon}
    <div className="w-full">
      <div className="flex items-center gap-1 mb-1">
        <label className={`block text-sm font-semibold ${textColor}`}>
          {label}
        </label>
        <span title={info}>
          <svg className={`w-3 h-3 ${textColor}`} viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
            <path d="M12 8v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${textColor} ${inputClass}`}
        min={min}
        max={max}
      />
      <span className={`${textColor} text-sm opacity-90`}>{description}</span>
    </div>
  </div>
);

export default InputField;

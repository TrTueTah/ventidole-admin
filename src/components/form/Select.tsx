import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Option {
  image?: string;
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  defaultValue = '',
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  console.log('Selected Value:', defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`shadow-theme-xs flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm ${
          selectedValue ? 'text-gray-800' : 'text-gray-400'
        }`}
      >
        <span className="flex-1">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedValue === option.value
                    ? 'text-brand-600 bg-gray-50'
                    : 'text-gray-700'
                }`}
              >
                {option.image && (
                  <Image
                    src={option.image}
                    alt={option.label}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-contain"
                  />
                )}

                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;

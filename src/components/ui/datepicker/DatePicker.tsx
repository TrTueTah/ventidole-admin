'use client';

import React from 'react';
import { CalenderIcon } from '@/icons';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  min?: string;
  max?: string;
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  min,
  max,
}: DatePickerProps) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <CalenderIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

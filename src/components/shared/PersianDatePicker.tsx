'use client';

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar as CalendarIcon } from "lucide-react";

interface PersianDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  withTime?: boolean;
  placeholder?: string;
}

export default function PersianDatePicker({ 
  value, 
  onChange, 
  withTime = false, 
  placeholder = "انتخاب تاریخ..." 
}: PersianDatePickerProps) {
  return (
    <div className="relative w-full">
      <DatePicker
        value={value}
        onChange={(date) => onChange(date ? date.toDate() : null)}
        calendar={persian}
        locale={persian_fa}
        format={withTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD"}
        placeholder={placeholder}
        calendarPosition="bottom-right"
        inputClass="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] pr-11 pl-4 py-3 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white"
        containerClassName="w-full"
      />
      <CalendarIcon 
        size={18} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c61d70] pointer-events-none" 
      />
    </div>
  );
}
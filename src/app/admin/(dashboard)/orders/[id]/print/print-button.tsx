'use client';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold text-white bg-[#c61d70] px-6 py-2 rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d]">
      <Printer size={16} /> چاپ فاکتور و لیبل
    </button>
  );
}
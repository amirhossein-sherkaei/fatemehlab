'use client';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('کد رهگیری کپی شد');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('خطا در کپی کردن');
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-2 bg-white rounded-lg shadow-sm border border-border hover:bg-sage/10 hover:text-sage transition-all text-muted-foreground"
      title="کپی کد رهگیری"
    >
      {copied ? <Check className="w-5 h-5 text-sage" /> : <Copy className="w-5 h-5" />}
    </button>
  );
}
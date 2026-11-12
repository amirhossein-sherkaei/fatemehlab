export function formatNumberInput(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const str = value.toString().replace(/,/g, '');
  const num = Number(str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
}

export function parseNumberInput(value: string): number | '' {
  if (!value || value.trim() === '') return '';
  const str = value.replace(/,/g, '');
  const num = Number(str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()));
  return isNaN(num) ? '' : num;
}

export function formatPersianDate(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch { return ''; }
}

export function formatPersianDateTime(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  } catch { return ''; }
}
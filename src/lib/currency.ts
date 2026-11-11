export function tomanToRial(toman: number): number {
  return Math.round(toman * 10);
}

export function rialToToman(rial: number): number {
  return Math.round(rial / 10);
}

export function formatToman(rial: number): string {
  if (!rial || rial === 0) return 'به زودی';
  return rialToToman(rial).toLocaleString('fa-IR') + ' تومان';
}

export function formatTomanPlain(rial: number): string {
  if (!rial || rial === 0) return 'تعیین نشده';
  return rialToToman(rial).toLocaleString('fa-IR');
}
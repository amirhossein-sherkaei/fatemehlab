const unverifiedSeedDescriptions = new Set([
  'آبرسان و شفاف‌کننده پوست',
  'تقویت‌کننده و ضخیم‌کننده مو',
  'پاک‌سازی عمیق پوست',
  'پوشش طبیعی و ماندگار',
]);

const knownNonProductAssets = [
  'home-services.webp',
  'lumen.png.png',
];

export function getPublicProductDescription(description: string | null | undefined): string | null {
  const value = description?.replace(/\s+/g, ' ').trim();
  if (!value) return null;
  if (unverifiedSeedDescriptions.has(value)) return null;
  return value;
}

export function getPublicProductImage(image: string | null | undefined): string | null {
  if (!image) return null;
  const normalized = image.toLowerCase().split('?')[0];
  if (knownNonProductAssets.some((asset) => normalized.includes(asset))) return null;
  return image;
}
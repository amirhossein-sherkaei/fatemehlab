import 'dotenv/config';
import { db } from '../lib/db';
import { products } from './schema';
import { eq } from 'drizzle-orm';

type Spec = { key: string; value: string };

type ProductUpdate = {
  slug: string;
  data: {
    name?: string;
    brand?: string;
    countryOfOrigin?: string;
    skinType?: string;
    warnings?: string;
    description?: string;
    ingredients?: string;
    usage?: string;
    specifications?: Spec[];
  };
};

const updates: ProductUpdate[] = [
  {
    slug: 'toner-vitabla',
    data: {
      name: 'تونر روشن‌کننده ویتابلا',
      brand: 'ویتابلا (Vitabella)',
      countryOfOrigin: 'ایران',
      skinType: 'همه انواع پوست',
      warnings: 'قبل از استفاده تست حساسیت روی ناحیه‌ای کوچک از پوست انجام دهید. از تماس با چشم خودداری کنید.',
      description: 'روشن و شفاف‌کننده پوست صورت و کاهش لک‌های قهوه‌ای؛ حاوی آلفا آربوتین و نیاسینامید.',
      ingredients: 'Aqua, PEG 6 Caprylic Capric Glycerides, PEG 40 Hydrogenated Castor Oil, Glycerin, Na PCA, Cranberry extract, Alpha Arbutin, Disodium EDTA, Sodium Benzoate, Potassium Sorbate, Glycolic Acid, Niacinamide, Allantoin, Fragrance.',
      usage: 'آرایش خود را با استفاده از یک پد پنبه‌ای آغشته به تونر پاک کنید. برای بهترین نتیجه دوبار در روز صبح و عصر از تونر استفاده کنید.',
      specifications: [
        { key: 'برند', value: 'ویتابلا (Vitabella)' },
        { key: 'حجم', value: '۲۲۰ میلی‌لیتر' },
        { key: 'کشور سازنده', value: 'ایران (PSEZ)' },
        { key: 'کد GTIN', value: '6269572204429' }
      ]
    }
  },
  {
    slug: 'shampoo-moringa',
    data: {
      name: 'شامپو مورینگا اکسونیک',
      brand: 'اکسونیک (Exonic)',
      countryOfOrigin: 'ایران',
      skinType: 'موی معمولی',
      warnings: 'از تماس مستقیم با چشم خودداری کنید. در صورت تماس با آب فراوان بشویید.',
      description: 'شامپو تقویت‌کننده موی سر حاوی روغن مورینگا؛ مناسب برای تقویت و ضخیم‌ترشدن مو.',
      ingredients: 'آب دیونیزه، آمونیوم لوریل سولفات، کوکامیدوپروپیل بتائین، روغن مورینگا، سدیم کلراید، گلیسرین، اسانس.',
      usage: 'موها را خیس نمایید، مقدار کافی از شامپو را به مدت دو تا سه دقیقه روی موها ماساژ دهید و سپس آبکشی کنید.',
      specifications: [
        { key: 'برند', value: 'اکسونیک (Exonic)' },
        { key: 'حجم', value: '۳۰۰ میلی‌لیتر (۱۰ FL.OZ)' },
        { key: 'کاربرد', value: 'تقویت‌کننده و ضخیم‌کننده مو' }
      ]
    }
  },
  {
    slug: 'exfoliating-soap',
    data: {
      name: 'صابون روشن‌کننده و لایه‌بردار بیز',
      brand: 'بیز (BIZ)',
      countryOfOrigin: 'ایران',
      skinType: 'پوست چرب',
      warnings: 'حاوی اسید گلیکولیک و پودر هسته زردآلو است. پس از استفاده از ضد آفتاب استفاده کنید. از تماس با چشم خودداری کنید.',
      description: 'صابون لایه‌بردار و روشن‌کننده مناسب برای دست و صورت؛ حاوی پودر هسته زردآلو و اسید گلیکولیک.',
      ingredients: 'Tallow oil, Sodium hydroxide, Coconut acid, Soy fatty acid, Glycerin, Cetyl alcohol, Paraffin, Sodium phosphate, Beat berry glycolic extract, Glycerin, Beeswax, Petrolatum, Fragrance, Castor oil, Apricot kernel powder, Ascorbic acid, BHT, Deionized water.',
      usage: 'پوست خود را شسته و قالب صابون را به آرامی روی آن بمالید، سپس کمی بشویید. در دمای محیط و در جای خشک نگهداری شود.',
      specifications: [
        { key: 'برند', value: 'بیز (BIZ)' },
        { key: 'وزن', value: '۱۰۰ گرم' },
        { key: 'کشور سازنده', value: 'ایران' },
        { key: 'کد IRC', value: '5619427734280689' },
        { key: 'ویژگی', value: 'حاوی پودر هسته زردآلو و اسید گلیکولیک' }
      ]
    }
  },
  {
    slug: 'pancake-101',
    data: {
      name: 'پنکیک مات ۱۰۱ بیز',
      brand: 'بیز (BIZ)',
      countryOfOrigin: 'ایران',
      skinType: 'همه انواع پوست',
      warnings: 'در جای خشک و خنک نگهداری شود. از قرار گرفتن در معرض نور مستقیم خورشید پرهیز کنید.',
      description: 'پنکیک مات با پوشش‌دهی عالی و SPF-25؛ مناسب برای یکدست‌کردن رنگ پوست و تثبیت آرایش.',
      ingredients: 'Talc, Calamine, Processed Starch, Zinc Oxide, Kaolin, Titanium oxide, Aloe Vera Extract, Pigments, Vitamin E, Methyl Paraben.',
      usage: 'با استفاده از اسفنج مخصوص، مقدار مناسبی از پودر را روی پوست صورت بزنید. برای نتیجه بهتر، از پرایمر قبل از پنکیک استفاده کنید.',
      specifications: [
        { key: 'برند', value: 'بیز (BIZ)' },
        { key: 'وزن', value: '۱۴ گرم' },
        { key: 'کشور سازنده', value: 'ایران' },
        { key: 'ضد آفتاب', value: 'SPF-25' },
        { key: 'تاریخ تولید', value: '۰۶ آگوست ۲۰۲۵' }
      ]
    }
  }
];

async function main() {
  console.log('Updating 4 products with verified data...\n');
  for (const { slug, data } of updates) {
    const existing = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
    if (existing.length === 0) {
      console.log('  skip (not found): ' + slug);
      continue;
    }
    await db.update(products).set(data).where(eq(products.slug, slug));
    console.log('  updated: ' + slug);
  }
  console.log('\nDone.');
  process.exit(0);
}

main().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
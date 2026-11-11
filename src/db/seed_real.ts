import { db } from '../lib/db';
import { products } from './schema';
import { notInArray } from 'drizzle-orm';

async function seed() {
  console.log('🌱 در حال پاکسازی محصولات قبلی و تزریق اطلاعات واقعی...');
  
  // پاک کردن محصولات قبلی برای جلوگیری از تداخل
  await db.delete(products);
  
  await db.insert(products).values([
    {
      name: 'تونر روشن‌کننده ویتابلا',
      slug: 'toner-vitabla',
      description: 'روشن و شفاف‌کننده پوست صورت و کاهش لک‌های قهوه‌ای رنگ پوست (حاوی آلفا آربوتین و نیاسینامید)',
      price: 0, 
      stock: 10,
      status: 'published',
      categoryId: null, 
      isFeatured: true,
      ingredients: 'Aqua, PEG 6 Caprylic Capric Glycerides, PEG 40 Hydrogenated Castor Oil, Glycerin, Na PCA, Cranberry extract, Alpha Arbutin, Disodium EDTA, Sodium Benzoate, Potassium Sorbate, Glycolic Acid, Niacinamide, Allantoin, Fragrance.',
      usage: 'آرایش خود را با استفاده از یک پد پنبه‌ای آغشته به تونر پاک کنید. برای بهترین نتیجه دوبار در روز صبح و عصر از تونر استفاده کنید.',
      specifications: [
        { key: 'برند', value: 'ویتابلا (Vitabella)' },
        { key: 'حجم', value: '۲۲۰ میلی‌لیتر' },
        { key: 'کشور سازنده', value: 'ایران (PSEZ)' },
        { key: 'کد GTIN', value: '6269572204429' }
      ]
    },
    {
      name: 'شامپو مورینگا اکسونیک',
      slug: 'shampoo-moringa',
      description: 'شامپو تقویت‌کننده موی سر حاوی روغن مورینگا',
      price: 0,
      stock: 5,
      status: 'published',
      categoryId: null,
      isFeatured: false,
      ingredients: 'آب دیونیزه، آمونیوم لوریل سولفات، کوکامیدوپروپیل بتائین، روغن مورینگا و...',
      usage: 'موها را خیس نموده، مقدار کافی از شامپو را به مدت دو تا سه دقیقه بر روی موها ماساژ داده سپس آبکشی نمایید.',
      specifications: [
        { key: 'برند', value: 'اکسونیک (Exonic)' },
        { key: 'حجم', value: '۳۰۰ میلی‌لیتر (۱۰ FL.OZ)' },
        { key: 'کاربرد', value: 'تقویت‌کننده و ضخیم‌کننده مو' }
      ]
    },
    {
      name: 'صابون روشن‌کننده و لایه‌بردار بیز',
      slug: 'exfoliating-soap',
      description: 'صابون لایه‌بردار و روشن‌کننده مناسب برای دست و صورت',
      price: 0,
      stock: 0,
      status: 'published',
      categoryId: null,
      isFeatured: false,
      ingredients: 'Tallow oil, Sodium hydroxide, Coconut acid, Soy fatty acid, Glycerin, Cetyl alcohol, Paraffin, Sodium phosphate, Beat berry glycolic extract, Glycerin, Beeswax, Petrolatum, Fragrance, Castor oil, Apricot kernel powder, Ascorbic acid, BHT, Deionized water.',
      usage: 'پوست خود را شسته و قالب صابون را به آرامی روی آن بمالید و پس از آن کمی آن را بشویید. شرایط نگهداری: در دمای محیط و در جای خشک نگهداری شود.',
      specifications: [
        { key: 'برند', value: 'بیز (BIZ)' },
        { key: 'وزن', value: '۱۰۰ گرم' },
        { key: 'کشور سازنده', value: 'ایران' },
        { key: 'کد IRC', value: '5619427734280689' },
        { key: 'ویژگی', value: 'حاوی پودر هسته زردآلو و اسید گلیکولیک' }
      ]
    },
    {
      name: 'پنکیک ۱۰۱ (لوکسری کویین)',
      slug: 'pancake-101',
      description: 'کامپکت پودر با پوشش‌دهی عالی و محافظت در برابر آفتاب (SPF-25)',
      price: 0,
      stock: 2,
      status: 'published',
      categoryId: null,
      isFeatured: false,
      ingredients: 'Talc, Calamine, Processed Starch, Zinc Oxide, Kaolin, Titanium oxide, Aloe Vera Extract, Pigments, Vitamin E, Methyl Paraben.',
      usage: 'با استفاده از اسفنج مخصوص، مقدار مناسب از پودر را روی پوست صورت بزنید.',
      specifications: [
        { key: 'برند', value: 'بیز (BIZ)' },
        { key: 'وزن', value: '۱۴ گرم' },
        { key: 'کشور سازنده', value: 'AFZ' },
        { key: 'ضد آفتاب', value: 'SPF-25' },
        { key: 'تاریخ تولید', value: '۰۶ آگوست ۲۰۲۵' }
      ]
    }
  ]);

  console.log('✅ ۴ محصول با اطلاعات واقعی و مشخصات کامل جایگزین شدند!');
  process.exit(0);
}
seed();
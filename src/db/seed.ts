import 'dotenv/config';
import { db } from '../lib/db';
import { products } from './schema';

async function seed() {
  console.log('🌱 در حال تزریق محصولات به دیتابیس...');
  await db.insert(products).values([
    { name: 'تونر ویتابلا', slug: 'toner-vitabla', status: 'published', price: 0, stock: 10, description: 'آبرسان و شفاف‌کننده پوست', isFeatured: true },
    { name: 'شامپو مورینگا', slug: 'shampoo-moringa', status: 'published', price: 0, stock: 5, description: 'تقویت‌کننده و ضخیم‌کننده مو', isFeatured: true },
    { name: 'صابون لایه‌بردار', slug: 'exfoliating-soap', status: 'published', price: 0, stock: 0, description: 'پاک‌سازی عمیق پوست' },
    { name: 'پنکیک ۱۰۱', slug: 'pancake-101', status: 'published', price: 0, stock: 2, description: 'پوشش طبیعی و ماندگار' },
  ]);
  console.log('✅ محصولات با موفقیت به دیتابیس اضافه شدند!');
  process.exit(0);
}
seed();

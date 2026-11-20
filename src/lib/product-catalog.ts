import { asc, desc, getTableColumns, sql } from 'drizzle-orm';
import { orders, orderItems, products, reviews } from '@/db/schema';

/** FBL_PRODUCT_CATALOG_HELPER_V1 — Shared catalogue selection, merchandising metrics and sorting. */
export const PRODUCT_PAGE_SIZE = 12;

const approvedRatingAverage = sql<number>`coalesce((
  select avg(${reviews.rating})
  from ${reviews}
  where ${reviews.productId} = ${products.id}
    and ${reviews.status} = 'approved'
), 0)`.as('rating_average');

const approvedRatingCount = sql<number>`(
  select count(*)
  from ${reviews}
  where ${reviews.productId} = ${products.id}
    and ${reviews.status} = 'approved'
)`.as('rating_count');

export const productCatalogSelection = {
  ...getTableColumns(products),
  ratingAverage: approvedRatingAverage,
  ratingCount: approvedRatingCount,
};

const salesOrder = sql`coalesce((
  select sum(${orderItems.quantity})
  from ${orderItems}
  inner join ${orders} on ${orders.id} = ${orderItems.orderId}
  where ${orderItems.productId} = ${products.id}
    and ${orders.status} in ('paid', 'processing', 'delivered')
), 0)`;

const ratingOrder = sql`coalesce((
  select avg(${reviews.rating})
  from ${reviews}
  where ${reviews.productId} = ${products.id}
    and ${reviews.status} = 'approved'
), 0)`;

export function getProductSortOrder(sort: string) {
  switch (sort) {
    case 'cheapest':
      return [asc(products.price), desc(products.createdAt)];
    case 'expensive':
      return [desc(products.price), desc(products.createdAt)];
    case 'bestselling':
      return [desc(salesOrder), desc(products.createdAt)];
    case 'toprated':
      return [desc(ratingOrder), desc(products.createdAt)];
    case 'featured':
      return [desc(products.isFeatured), desc(products.createdAt)];
    case 'newest':
    default:
      return [desc(products.createdAt)];
  }
}

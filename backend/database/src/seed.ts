import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const STORES = [
  { id: 'store_tech_001', name: 'Tech Gadgets Store', ownerId: 'user_001' },
  { id: 'store_fashion_002', name: 'Fashion Hub', ownerId: 'user_002' },
];

const PRODUCTS: Record<string, string[]> = {
  store_tech_001: ['prod_airpods', 'prod_macbook', 'prod_iphone', 'prod_ipad', 'prod_watch'],
  store_fashion_002: ['prod_sneakers', 'prod_jacket', 'prod_jeans', 'prod_tshirt', 'prod_bag'],
};

const PRODUCT_PRICES: Record<string, number> = {
  prod_airpods: 129,
  prod_macbook: 1299,
  prod_iphone: 999,
  prod_ipad: 599,
  prod_watch: 399,
  prod_sneakers: 89,
  prod_jacket: 149,
  prod_jeans: 59,
  prod_tshirt: 29,
  prod_bag: 119,
};

const EVENT_WEIGHTS = [
  { type: 'page_view', weight: 0.55 },
  { type: 'add_to_cart', weight: 0.20 },
  { type: 'remove_from_cart', weight: 0.08 },
  { type: 'checkout_started', weight: 0.09 },
  { type: 'purchase', weight: 0.08 },
];

const EVENTS_WITH_PRODUCT = new Set(['add_to_cart', 'remove_from_cart', 'purchase']);

function pickWeighted<T>(items: { type: T; weight: number }[]): T {
  let cumulative = 0;
  const rand = Math.random();
  for (const item of items) {
    cumulative += item.weight;
    if (rand < cumulative) return item.type;
  }
  return items[items.length - 1]!.type;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDailyEventCount(dayOffset: number) {
  const isWeekend = dayOffset % 7 === 0 || dayOffset % 7 === 6;
  const base = randomInt(120, 280);
  return isWeekend ? Math.floor(base * 1.3) : base;
}

async function seedStores() {
  for (const store of STORES) {
    await prisma.store.upsert({
      where: { id: store.id },
      update: { name: store.name },
      create: store,
    });
  }
  console.log(`✓ ${STORES.length} stores upserted`);
}

async function seedEvents(storeId: string, daysBack: number) {
  const products = PRODUCTS[storeId] ?? [];
  const now = new Date();
  const batch: {
    storeId: string;
    eventType: string;
    timestamp: Date;
    productId: string | null;
    amount: number | null;
    currency: string | null;
  }[] = [];

  for (let day = daysBack; day >= 0; day--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - day);
    dayStart.setHours(0, 0, 0, 0);

    const count = getDailyEventCount(day);

    for (let i = 0; i < count; i++) {
      const eventType = pickWeighted(EVENT_WEIGHTS);
      const timestamp = new Date(dayStart.getTime() + randomInt(0, 1439) * 60_000);
      const product = products[randomInt(0, products.length - 1)] ?? null;

      const isPurchase = eventType === 'purchase';
      const basePrice = isPurchase && product ? (PRODUCT_PRICES[product] ?? 50) : 0;
      const amount = isPurchase && product
        ? parseFloat((basePrice * (0.95 + Math.random() * 0.1)).toFixed(2))
        : null;

      batch.push({
        storeId,
        eventType,
        timestamp,
        productId: EVENTS_WITH_PRODUCT.has(eventType) ? product : null,
        amount,
        currency: isPurchase ? 'USD' : null,
      });
    }
  }

  const CHUNK = 500;
  for (let i = 0; i < batch.length; i += CHUNK) {
    await prisma.event.createMany({ data: batch.slice(i, i + CHUNK) });
  }

  console.log(`✓ ${batch.length} events seeded for ${storeId}`);
}

async function seedDailyAggregates(storeId: string, daysBack: number) {
  const now = new Date();

  for (let day = daysBack; day >= 0; day--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const window = { gte: dayStart, lte: dayEnd };

    const [revenueResult, countsByType] = await Promise.all([
      prisma.event.aggregate({
        where: { storeId, eventType: 'purchase', timestamp: window },
        _sum: { amount: true },
      }),
      prisma.event.groupBy({
        by: ['eventType'],
        where: { storeId, timestamp: window },
        _count: { _all: true },
      }),
    ]);

    const counts = Object.fromEntries(countsByType.map((r) => [r.eventType, r._count._all]));
    const totalRevenue = Number(revenueResult._sum.amount ?? 0);

    await prisma.dailyAggregate.upsert({
      where: { storeId_date: { storeId, date: dayStart } },
      update: {
        totalRevenue,
        pageViews: counts['page_view'] ?? 0,
        purchases: counts['purchase'] ?? 0,
        addToCart: counts['add_to_cart'] ?? 0,
        checkoutStart: counts['checkout_started'] ?? 0,
      },
      create: {
        storeId,
        date: dayStart,
        totalRevenue,
        pageViews: counts['page_view'] ?? 0,
        purchases: counts['purchase'] ?? 0,
        addToCart: counts['add_to_cart'] ?? 0,
        checkoutStart: counts['checkout_started'] ?? 0,
      },
    });
  }

  console.log(`✓ Daily aggregates computed for ${storeId}`);
}

async function main() {
  const DAYS_BACK = 30;

  console.log('Clearing existing data...');
  await prisma.dailyAggregate.deleteMany();
  await prisma.event.deleteMany();
  await prisma.store.deleteMany();

  await seedStores();

  for (const store of STORES) {
    console.log(`\nSeeding "${store.name}"...`);
    await seedEvents(store.id, DAYS_BACK);
    await seedDailyAggregates(store.id, DAYS_BACK);
  }

  console.log('\nSeed complete!');
  console.log('  Store 1  x-store-id: store_tech_001     x-user-id: user_001');
  console.log('  Store 2  x-store-id: store_fashion_002  x-user-id: user_002');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

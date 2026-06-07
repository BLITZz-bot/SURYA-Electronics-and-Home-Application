const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with categories and products...');

  // 1. Create Categories
  const categories = [
    { name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800' },
    { name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800' },
    { name: 'Home Appliances', slug: 'home-appliances', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800' },
    { name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const allCats = await prisma.category.findMany();
  const getCatId = (slug) => allCats.find(c => c.slug === slug).id;

  // 2. Create Products
  const products = [
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'The ultimate smartphone with AI features and 200MP camera.',
      price: 129999,
      stock: 15,
      brand: 'Samsung',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800',
      categoryId: getCatId('smartphones'),
    },
    {
      name: 'MacBook Pro M3 14"',
      description: 'Powerful laptop for professionals with the latest Apple Silicon.',
      price: 169900,
      stock: 8,
      brand: 'Apple',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
      categoryId: getCatId('laptops'),
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading noise canceling headphones.',
      price: 29990,
      stock: 25,
      brand: 'Sony',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
      categoryId: getCatId('audio'),
    },
    {
      name: 'LG Double Door Refrigerator',
      description: 'Smart inverter compressor with energy saving features.',
      price: 45000,
      stock: 5,
      brand: 'LG',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800',
      categoryId: getCatId('home-appliances'),
    }
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

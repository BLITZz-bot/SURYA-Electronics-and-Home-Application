const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Samsung Galaxy S25",
      description: "Premium smartphone with the latest camera, performance, and battery.",
      price: 79999.0,
      stock: 25,
      category: "Mobile Phones",
      brand: "Samsung",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Sony 55-inch 4K LED Smart TV",
      description: "Immersive 4K HDR cinema experience with smart app access.",
      price: 45999.0,
      stock: 12,
      category: "Television",
      brand: "Sony",
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "IFB Front Load Washing Machine",
      description: "Efficient and silent 8 kg washing machine with smart wash programs.",
      price: 27999.0,
      stock: 18,
      category: "Home Appliances",
      brand: "IFB",
      imageUrl: "https://images.unsplash.com/photo-1586201375757-2fa1e8c2fe7d?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Bosch 36 L Convection Microwave Oven",
      description: "Easy cooking and reheating with intuitive controls and even heat distribution.",
      price: 17999.0,
      stock: 22,
      category: "Kitchen Appliances",
      brand: "Bosch",
      imageUrl: "https://images.unsplash.com/photo-1541544182454-4e0d9e2160b8?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Apple AirPods Pro 2nd Gen",
      description: "Noise-cancelling wireless earbuds with spatial audio and enhanced battery life.",
      price: 23999.0,
      stock: 30,
      category: "Accessories",
      brand: "Apple",
      imageUrl: "https://images.unsplash.com/photo-1585386959984-a415522e3f2f?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Philips Air Fryer",
      description: "Healthy and crisp frying with minimal oil and easy cleaning.",
      price: 9999.0,
      stock: 16,
      category: "Kitchen Appliances",
      brand: "Philips",
      imageUrl: "https://images.unsplash.com/photo-1575182877712-b6a226b68c1a?auto=format&fit=crop&w=800&q=80",
    },
  ];

  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: products,
  });

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

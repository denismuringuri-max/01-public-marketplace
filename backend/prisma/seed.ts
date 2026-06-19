import { PrismaClient } from '@prisma/client';
import { hashPassword } from './src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create categories
    const electronics = await prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
      },
    });

    const fashion = await prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
      },
    });

    const home = await prisma.category.create({
      data: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home and garden items',
      },
    });

    console.log('✅ Categories created');

    // Create admin user
    const adminPassword = await hashPassword('Admin@123');
    const admin = await prisma.user.create({
      data: {
        email: 'admin@miraa.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
      },
    });

    console.log('✅ Admin user created');

    // Create seller user
    const sellerPassword = await hashPassword('Seller@123');
    const seller = await prisma.user.create({
      data: {
        email: 'seller@miraa.com',
        password: sellerPassword,
        firstName: 'John',
        lastName: 'Seller',
        role: 'SELLER',
        emailVerified: true,
      },
    });

    console.log('✅ Seller user created');

    // Create buyer user
    const buyerPassword = await hashPassword('Buyer@123');
    const buyer = await prisma.user.create({
      data: {
        email: 'buyer@miraa.com',
        password: buyerPassword,
        firstName: 'Jane',
        lastName: 'Buyer',
        role: 'BUYER',
        emailVerified: true,
      },
    });

    console.log('✅ Buyer user created');

    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        categoryId: electronics.id,
        quantity: 50,
      },
      {
        name: 'USB-C Cable',
        description: 'Durable USB-C charging cable',
        price: 19.99,
        categoryId: electronics.id,
        quantity: 200,
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 29.99,
        categoryId: fashion.id,
        quantity: 100,
      },
      {
        name: 'Blue Jeans',
        description: 'Classic blue denim jeans',
        price: 79.99,
        categoryId: fashion.id,
        quantity: 75,
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 89.99,
        categoryId: home.id,
        quantity: 30,
      },
    ];

    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          sellerId: seller.id,
          inventory: {
            create: {
              quantity: product.quantity,
            },
          },
        },
      });
    }

    console.log('✅ Sample products created');

    console.log('✅ Database seed completed!');
    console.log('\nTest Credentials:');
    console.log('  Admin: admin@miraa.com / Admin@123');
    console.log('  Seller: seller@miraa.com / Seller@123');
    console.log('  Buyer: buyer@miraa.com / Buyer@123');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export const productController = {
  getAll: async (page: number = 1, limit: number = 20, category?: string, search?: string) => {
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (category) where.categoryId = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          images: { where: { isMain: true } },
          reviews: {
            select: { rating: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRating = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
          : 0;

      return {
        ...product,
        averageRating: avgRating,
      };
    });

    return {
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getById: async (id: string) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        inventory: true,
        reviews: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        seller: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const avgRating =
      product.reviews.length > 0
        ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
        : 0;

    return {
      ...product,
      averageRating: avgRating,
    };
  },

  create: async (
    sellerId: string,
    data: {
      name: string;
      description: string;
      price: number;
      discountPrice?: number;
      categoryId: string;
      quantity: number;
    },
  ) => {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        categoryId: data.categoryId,
        sellerId,
        inventory: {
          create: {
            quantity: data.quantity,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    return product;
  },

  update: async (
    productId: string,
    sellerId: string,
    data: Partial<{ name: string; description: string; price: number; discountPrice?: number; quantity: number }>,
  ) => {
    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.sellerId !== sellerId) {
      throw new AppError('Not authorized to update this product', 403);
    }

    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }
    if (data.description) updateData.description = data.description;
    if (data.price) updateData.price = data.price;
    if (data.discountPrice !== undefined) updateData.discountPrice = data.discountPrice;

    const updated = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: { inventory: true },
    });

    // Update inventory if provided
    if (data.quantity !== undefined) {
      await prisma.inventory.update({
        where: { productId },
        data: { quantity: data.quantity },
      });
    }

    return updated;
  },

  delete: async (productId: string, sellerId: string) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.sellerId !== sellerId) {
      throw new AppError('Not authorized to delete this product', 403);
    }

    await prisma.product.delete({
      where: { id: productId },
    });
  },
};

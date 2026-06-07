import { Request, Response } from 'express';
import prisma from '../prisma';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { 
        category: true,
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average ratings in memory for list view
    const productsWithRatings = products.map(p => {
      const avgRating = p.reviews.length > 0 
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length 
        : 0;
      return { ...p, avgRating, totalReviews: p._count.reviews };
    });

    res.json(productsWithRatings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, categoryId, brand, price, originalPrice, discountValue, discountType, stock, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        brand,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        discountType: discountType || null,
        stock: parseInt(stock),
        imageUrl,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: id as string },
      include: { 
        category: true,
        reviews: {
          include: { 
            user: { select: { name: true, image: true } },
            _count: { select: { helpfulVotes: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Aggregate ratings
    const totalReviews = product.reviews.length;
    const avgRating = totalReviews > 0 
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;
    
    const ratingBreakdown = {
      5: product.reviews.filter(r => r.rating === 5).length,
      4: product.reviews.filter(r => r.rating === 4).length,
      3: product.reviews.filter(r => r.rating === 3).length,
      2: product.reviews.filter(r => r.rating === 2).length,
      1: product.reviews.filter(r => r.rating === 1).length,
    };

    res.json({ ...product, avgRating, totalReviews, ratingBreakdown });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, brand, price, originalPrice, discountValue, discountType, stock, imageUrl } = req.body;
    const product = await prisma.product.update({
      where: { id: id as string },
      data: {
        name,
        description,
        categoryId,
        brand,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        discountType: discountType || null,
        stock: parseInt(stock),
        imageUrl,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: id as string },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

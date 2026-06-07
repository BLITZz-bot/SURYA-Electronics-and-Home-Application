import { Request, Response } from 'express';
import prisma from '../prisma';

export const getCart = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        user: { email: firebaseUser.email as string }
      },
      include: { product: true }
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }

  try {
    // 1. Find or sync user
    let user = await prisma.user.findUnique({
      where: { email: firebaseUser.email as string }
    });

    if (!user) {
      console.log('User not found in cart controller, syncing from firebase user:', firebaseUser.email);
      const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];
      const email = (firebaseUser.email as string).toLowerCase();
      user = await prisma.user.create({
        data: {
          email,
          name: firebaseUser.name || '',
          image: firebaseUser.picture || '',
          role: adminEmails.includes(email) ? 'admin' : 'customer',
        },
      });
    }

    // 2. Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 3. Upsert cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId: user.id,
        productId,
        quantity
      }
    });

    console.log(`Success: Added ${quantity} of ${productId} to cart for user ${user.id}`);
    res.json(cartItem);
  } catch (error: any) {
    console.error('CRITICAL: Add to cart failed:', error.message);
    res.status(500).json({ error: 'Internal server error adding to cart', details: error.message });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({
      where: { id: id as string }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

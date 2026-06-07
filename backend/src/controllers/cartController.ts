import { Request, Response } from 'express';
import prisma from '../prisma';

export const getCart = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        user: { email: firebaseUser.email }
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

  try {
    // Find the user in our DB
    const user = await prisma.user.findUnique({
      where: { email: firebaseUser.email }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

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

    res.json(cartItem);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
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

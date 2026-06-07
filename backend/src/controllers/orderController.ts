import { Request, Response } from 'express';
import prisma from '../prisma';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  if (!firebaseUser || !firebaseUser.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        user: { email: firebaseUser.email as string }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true } }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, paymentStatus } = req.body;
    const order = await prisma.order.update({
      where: { id },
      data: { status, paymentStatus },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.order.delete({
      where: { id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const { 
    shippingAddress, 
    shippingCity, 
    shippingPostalCode, 
    shippingCountry, 
    shippingPhone 
  } = req.body;

  try {
    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email: firebaseUser.email as string },
      include: { cartItems: { include: { product: true } } }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    // 2. Calculate total
    const totalAmount = user.cartItems.reduce((sum, item) => {
      return sum + (item.quantity * Number(item.product.price));
    }, 0);

    // 3. Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          shippingAddress,
          shippingCity,
          shippingPostalCode,
          shippingCountry,
          shippingPhone,
          items: {
            create: user.cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        }
      });

      // 4. Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

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
        user: { email: firebaseUser.email }
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
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: id as string },
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
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const order = await prisma.order.update({
      where: { id: id as string },
      data: { status, paymentStatus },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { id: id as string },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

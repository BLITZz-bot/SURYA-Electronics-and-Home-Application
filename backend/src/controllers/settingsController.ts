import { Request, Response } from 'express';
import prisma from '../prisma';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" }
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: "default" }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    delete data.id;

    const settings = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Order Stats
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
    const shippedOrders = await prisma.order.count({ where: { status: 'shipped' } });
    const deliveredOrders = await prisma.order.findMany({
      where: { status: 'delivered' },
      select: { totalAmount: true }
    });
    const deliveredCount = deliveredOrders.length;
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    // 2. Product Stats
    const totalProducts = await prisma.product.count();
    const outOfStockCount = await prisma.product.count({ where: { stock: 0 } });
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 } },
      take: 5,
      orderBy: { stock: 'asc' }
    });

    // 3. User Stats
    const totalCustomers = await prisma.user.count({ where: { role: 'customer' } });

    // 4. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });

    // 5. Today's Stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysOrders = await prisma.order.count({ where: { createdAt: { gte: today } } });

    res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredCount,
      totalProducts,
      outOfStockCount,
      lowStockProducts,
      totalCustomers,
      recentOrders,
      todaysOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

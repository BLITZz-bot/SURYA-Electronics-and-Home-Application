import { Request, Response } from 'express';
import prisma from '../prisma';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" }
    });

    if (!settings) {
      console.log("No settings found, creating default...");
      settings = await prisma.storeSettings.create({
        data: { 
          id: "default",
          storeName: "SURYA Electronics",
          currency: "INR",
          shippingFee: 0,
          taxRate: 0
        }
      });
    }
    res.json(settings);
  } catch (error: any) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
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
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // 1. Order Stats
    const totalOrders = await prisma.order.count();
    const pendingOrdersCount = await prisma.order.count({ where: { status: 'pending' } });
    const shippedOrdersCount = await prisma.order.count({ where: { status: 'shipped' } });
    const deliveredOrders = await prisma.order.findMany({
      where: { status: 'delivered' },
      select: { totalAmount: true }
    });
    const deliveredCount = deliveredOrders.length;
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 2. Growth Comparisons (MoM)
    // Revenue Growth
    const currentMonthRevenueOrders = await prisma.order.findMany({
      where: { status: 'delivered', createdAt: { gte: startOfCurrentMonth } },
      select: { totalAmount: true }
    });
    const currentMonthRevenue = currentMonthRevenueOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const lastMonthRevenueOrders = await prisma.order.findMany({
      where: { status: 'delivered', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      select: { totalAmount: true }
    });
    const lastMonthRevenue = lastMonthRevenueOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const revenueGrowth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : null;

    // Orders Growth
    const currentMonthOrders = await prisma.order.count({ where: { createdAt: { gte: startOfCurrentMonth } } });
    const lastMonthOrders = await prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } });
    const ordersGrowth = lastMonthOrders > 0 ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 : null;

    // Customers Growth
    const currentMonthCustomers = await prisma.user.count({ where: { role: 'customer', createdAt: { gte: startOfCurrentMonth } } });
    const lastMonthCustomers = await prisma.user.count({ where: { role: 'customer', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } });
    const customersGrowth = lastMonthCustomers > 0 ? ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : null;

    // 3. Product Stats
    const totalProducts = await prisma.product.count();
    const outOfStockCount = await prisma.product.count({ where: { stock: 0 } });
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 } },
      include: { category: true },
      take: 5,
      orderBy: { stock: 'asc' }
    });

    // 4. User Stats
    const totalCustomers = await prisma.user.count({ where: { role: 'customer' } });

    // 5. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });

    // 6. Chart Data: Monthly Revenue Trends (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const ordersLast6Months = await prisma.order.findMany({
      where: { 
        status: 'delivered',
        createdAt: { gte: sixMonthsAgo } 
      },
      select: { totalAmount: true, createdAt: true }
    });

    const monthlyRevenue = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const monthYear = d.getFullYear();
      
      const revenue = ordersLast6Months
        .filter(o => o.createdAt.getMonth() === d.getMonth() && o.createdAt.getFullYear() === d.getFullYear())
        .reduce((sum, o) => sum + Number(o.totalAmount), 0);
      
      monthlyRevenue.unshift({ month: monthLabel, revenue });
    }

    // 7. Chart Data: Category Performance
    const categoryStats = await prisma.category.findMany({
      include: {
        products: {
          include: {
            orderItems: {
              include: {
                order: { select: { status: true } }
              }
            }
          }
        }
      }
    });

    const categoryPerformance = categoryStats.map(cat => {
      let sales = 0;
      let revenue = 0;
      cat.products.forEach(p => {
        p.orderItems.forEach(item => {
          if (item.order.status === 'delivered') {
            sales += item.quantity;
            revenue += Number(item.price) * item.quantity;
          }
        });
      });
      return { name: cat.name, sales, revenue };
    }).filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue);

    // 8. Order Status Distribution
    const orderStatusDistribution = [
      { name: 'Pending', value: await prisma.order.count({ where: { status: 'pending' } }) },
      { name: 'Shipped', value: await prisma.order.count({ where: { status: 'shipped' } }) },
      { name: 'Delivered', value: await prisma.order.count({ where: { status: 'delivered' } }) },
      { name: 'Cancelled', value: await prisma.order.count({ where: { status: 'cancelled' } }) },
    ].filter(s => s.value > 0);

    // 9. Chart Data: Orders Trend (Last 6 months)
    const monthlyOrders = [];
    const allOrdersLast6Months = await prisma.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true }
    });

    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      
      const count = allOrdersLast6Months
        .filter(o => o.createdAt.getMonth() === d.getMonth() && o.createdAt.getFullYear() === d.getFullYear())
        .length;
      
      monthlyOrders.unshift({ month: monthLabel, orders: count });
    }

    // 10. Chart Data: Customer Growth
    const monthlyCustomersList = [];
    const customersLast6Months = await prisma.user.findMany({
      where: { 
        role: 'customer',
        createdAt: { gte: sixMonthsAgo } 
      },
      select: { createdAt: true }
    });

    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      
      const count = customersLast6Months
        .filter(u => u.createdAt.getMonth() === d.getMonth() && u.createdAt.getFullYear() === d.getFullYear())
        .length;
      
      monthlyCustomersList.unshift({ month: monthLabel, customers: count });
    }

    // 11. Top Selling Products
    const topSellingProducts = await prisma.product.findMany({
      include: {
        category: true,
        orderItems: {
          where: { order: { status: 'delivered' } },
          select: { quantity: true, price: true }
        }
      },
      take: 5
    });

    const topProductsFormatted = topSellingProducts.map(p => {
      const sales = p.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const revenue = p.orderItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
      return { 
        name: p.name, 
        sales, 
        revenue,
        category: p.category.name,
        stock: p.stock
      };
    }).filter(p => p.sales > 0).sort((a, b) => b.sales - a.sales);

    res.json({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      deliveredCount,
      totalProducts,
      outOfStockCount,
      totalCustomers,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      recentOrders,
      monthlyRevenue,
      categoryPerformance,
      orderStatusDistribution,
      monthlyOrders,
      monthlyCustomers: monthlyCustomersList,
      topProducts: topProductsFormatted,
      lowStockProducts: lowStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        stock: p.stock,
        imageUrl: p.imageUrl
      }))
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.updateSettings = exports.getSettings = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getSettings = async (req, res) => {
    try {
        let settings = await prisma_1.default.storeSettings.findUnique({
            where: { id: "default" }
        });
        if (!settings) {
            settings = await prisma_1.default.storeSettings.create({
                data: { id: "default" }
            });
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const data = req.body;
        delete data.id;
        const settings = await prisma_1.default.storeSettings.upsert({
            where: { id: "default" },
            update: data,
            create: { id: "default", ...data }
        });
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
};
exports.updateSettings = updateSettings;
const getDashboardStats = async (req, res) => {
    try {
        // 1. Order Stats
        const totalOrders = await prisma_1.default.order.count();
        const pendingOrders = await prisma_1.default.order.count({ where: { status: 'pending' } });
        const shippedOrders = await prisma_1.default.order.count({ where: { status: 'shipped' } });
        const deliveredOrders = await prisma_1.default.order.findMany({
            where: { status: 'delivered' },
            select: { totalAmount: true }
        });
        const deliveredCount = deliveredOrders.length;
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        // 2. Product Stats
        const totalProducts = await prisma_1.default.product.count();
        const outOfStockCount = await prisma_1.default.product.count({ where: { stock: 0 } });
        const lowStockProducts = await prisma_1.default.product.findMany({
            where: { stock: { lte: 5 } },
            take: 5,
            orderBy: { stock: 'asc' }
        });
        // 3. User Stats
        const totalCustomers = await prisma_1.default.user.count({ where: { role: 'customer' } });
        // 4. Recent Orders
        const recentOrders = await prisma_1.default.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, email: true, name: true } }
            }
        });
        // 5. Today's Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysOrders = await prisma_1.default.order.count({ where: { createdAt: { gte: today } } });
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
    }
    catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
exports.getDashboardStats = getDashboardStats;

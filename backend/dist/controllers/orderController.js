"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getMyOrders = exports.getOrders = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getOrders = async (req, res) => {
    try {
        const orders = await prisma_1.default.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            }
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getOrders = getOrders;
const getMyOrders = async (req, res) => {
    const firebaseUser = req.user;
    if (!firebaseUser || !firebaseUser.email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const orders = await prisma_1.default.order.findMany({
            where: {
                user: { email: firebaseUser.email }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                items: { include: { product: true } }
            }
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch your orders' });
    }
};
exports.getMyOrders = getMyOrders;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma_1.default.order.findUnique({
            where: { id: id },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            }
        });
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};
exports.getOrderById = getOrderById;
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;
        const order = await prisma_1.default.order.update({
            where: { id: id },
            data: { status, paymentStatus },
        });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};
exports.updateOrder = updateOrder;
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.order.delete({
            where: { id: id },
        });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
exports.deleteOrder = deleteOrder;

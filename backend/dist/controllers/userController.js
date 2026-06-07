"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.getProfile = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getProfile = async (req, res) => {
    const firebaseUser = req.user;
    if (!firebaseUser || !firebaseUser.email) {
        return res.status(401).json({ error: 'User not found in token' });
    }
    try {
        // Check if user exists in our DB, if not create them
        let user = await prisma_1.default.user.findUnique({
            where: { email: firebaseUser.email },
        });
        if (!user) {
            // Check if this is the initial admin
            const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];
            const role = adminEmails.includes(firebaseUser.email.toLowerCase()) ? 'admin' : 'customer';
            user = await prisma_1.default.user.create({
                data: {
                    email: firebaseUser.email,
                    name: firebaseUser.name || '',
                    image: firebaseUser.picture || '',
                    role: role,
                },
            });
        }
        else {
            // Check if they should be promoted to admin based on ENV (Owner safeguard)
            const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];
            if (user.role !== 'admin' && adminEmails.includes(user.email?.toLowerCase() || '')) {
                user = await prisma_1.default.user.update({
                    where: { id: user.id },
                    data: { role: 'admin' },
                });
            }
        }
        res.json(user);
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
exports.getProfile = getProfile;
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { orders: true } },
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma_1.default.user.findUnique({
            where: { id: id },
            include: {
                orders: { include: { items: { include: { product: true } } } },
                addresses: true
            }
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await prisma_1.default.user.update({
            where: { id: id },
            data: { role },
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.user.delete({
            where: { id: id },
        });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;

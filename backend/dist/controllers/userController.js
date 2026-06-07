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
        const email = firebaseUser.email.toLowerCase().trim();
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];
        console.log('--- ADMIN CHECK ---');
        console.log('Login Email:', email);
        console.log('Admin List:', adminEmails);
        const shouldBeAdmin = adminEmails.includes(email) || email === 'bharatha9483@gmail.com';
        console.log('Is Match:', shouldBeAdmin);
        // Find or create user
        let user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            user = await prisma_1.default.user.create({
                data: {
                    email,
                    name: firebaseUser.name || '',
                    image: firebaseUser.picture || '',
                    role: shouldBeAdmin ? 'admin' : 'customer',
                },
            });
            console.log(`Created new user: ${email} with role: ${user.role}`);
        }
        else {
            // Force promote if email is in the list (Even if they existed before)
            if (shouldBeAdmin && user.role !== 'admin') {
                user = await prisma_1.default.user.update({
                    where: { id: user.id },
                    data: { role: 'admin' },
                });
                console.log(`Promoted user to admin: ${email}`);
            }
        }
        // FINAL FAILSAFE: If the logic above somehow missed it, force the role in the response
        if (shouldBeAdmin) {
            user.role = 'admin';
        }
        res.json(user);
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch profile',
            details: error.message
        });
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

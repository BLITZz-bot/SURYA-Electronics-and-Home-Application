"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.createProduct = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getProducts = async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    try {
        const { name, description, categoryId, brand, price, stock, imageUrl } = req.body;
        const product = await prisma_1.default.product.create({
            data: {
                name,
                description,
                categoryId,
                brand,
                price: parseFloat(price),
                stock: parseInt(stock),
                imageUrl,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};
exports.createProduct = createProduct;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { id: id },
            include: { category: true },
        });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, categoryId, brand, price, stock, imageUrl } = req.body;
        const product = await prisma_1.default.product.update({
            where: { id: id },
            data: {
                name,
                description,
                categoryId,
                brand,
                price: parseFloat(price),
                stock: parseInt(stock),
                imageUrl,
            },
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.product.delete({
            where: { id: id },
        });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;

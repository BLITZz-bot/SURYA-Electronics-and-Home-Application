"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Private routes
router.get('/my-orders', authMiddleware_1.verifyToken, orderController_1.getMyOrders);
// Admin-only routes
router.get('/', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, orderController_1.getOrders);
router.get('/:id', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, orderController_1.getOrderById);
router.patch('/:id', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, orderController_1.updateOrder);
router.delete('/:id', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, orderController_1.deleteOrder);
exports.default = router;

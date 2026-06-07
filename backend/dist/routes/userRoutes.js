"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Private profile route
router.get('/profile', authMiddleware_1.verifyToken, userController_1.getProfile);
// Admin-only routes
router.get('/', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, userController_1.getUsers);
router.get('/:id', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, userController_1.getUserById);
router.patch('/:id', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, userController_1.updateUser);
router.delete('/:id', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, userController_1.deleteUser);
exports.default = router;

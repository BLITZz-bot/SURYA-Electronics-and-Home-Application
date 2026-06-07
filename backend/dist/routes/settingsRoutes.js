"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingsController_1 = require("../controllers/settingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Admin-only routes
router.get('/', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, settingsController_1.getSettings);
router.patch('/', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, settingsController_1.updateSettings);
router.get('/stats', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, settingsController_1.getDashboardStats);
exports.default = router;

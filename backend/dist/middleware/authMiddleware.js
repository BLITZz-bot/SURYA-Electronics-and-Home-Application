"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const admin = __importStar(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        const keyPath = path_1.default.join(process.cwd(), 'firebase-key.json');
        if (fs_1.default.existsSync(keyPath)) {
            // Prefer local JSON file for testing
            admin.initializeApp({
                credential: admin.credential.cert(keyPath),
            });
            console.log('Firebase Admin initialized using firebase-key.json');
        }
        else {
            // Fallback to Env variable for production (Render)
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
            if (serviceAccount.project_id) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                console.log('Firebase Admin initialized using Environment Variable');
            }
            else {
                console.error('Firebase Admin Error: No credentials found (JSON or ENV)');
            }
        }
    }
    catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => {
    const user = req.user;
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];
    if (user && user.email && adminEmails.includes(user.email.toLowerCase())) {
        next();
    }
    else {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
};
exports.isAdmin = isAdmin;

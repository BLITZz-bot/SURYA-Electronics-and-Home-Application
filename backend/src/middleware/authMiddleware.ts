import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

// Initialize Firebase Admin
// You will need to add FIREBASE_SERVICE_ACCOUNT as an environment variable in Render
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];

  if (user && user.email && adminEmails.includes(user.email.toLowerCase())) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};

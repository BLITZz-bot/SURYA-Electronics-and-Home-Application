import { Request, Response } from 'express';
import prisma from '../prisma';

export const getProfile = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  
  if (!firebaseUser || !firebaseUser.email) {
    return res.status(401).json({ error: 'User not found in token' });
  }

  try {
    // Check if user exists in our DB, if not create them
    let user = await prisma.user.findUnique({
      where: { email: firebaseUser.email },
    });

    if (!user) {
      // Check if this is the initial admin
      const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];
      const role = adminEmails.includes(firebaseUser.email.toLowerCase()) ? 'admin' : 'customer';

      user = await prisma.user.create({
        data: {
          email: firebaseUser.email,
          name: firebaseUser.name || '',
          image: firebaseUser.picture || '',
          role: role,
        },
      });
    } else {
      // Check if they should be promoted to admin based on ENV (Owner safeguard)
      const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];
      if (user.role !== 'admin' && adminEmails.includes(user.email?.toLowerCase() || '')) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'admin' },
        });
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: id as string },
      include: {
        orders: { include: { items: { include: { product: true } } } },
        addresses: true
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: id as string },
      data: { role },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: id as string },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

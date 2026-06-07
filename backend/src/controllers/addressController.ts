import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAddresses = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  try {
    const user = await prisma.user.findUnique({
      where: { email: firebaseUser.email as string },
      include: { addresses: true }
    });
    res.json(user?.addresses || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const { 
    name, phone, houseNumber, street, area, city, 
    district, state, country, postalCode, latitude, longitude, isDefault 
  } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email: firebaseUser.email as string } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        name,
        phone,
        houseNumber,
        street,
        area,
        city,
        district,
        state,
        country: country || 'India',
        postalCode,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        isDefault: isDefault || false
      }
    });
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create address' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const id = req.params.id as string;
  try {
    const user = await prisma.user.findUnique({ where: { email: firebaseUser.email as string } });
    const address = await prisma.address.findUnique({ where: { id } });
    
    if (!address || address.userId !== user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.address.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const id = req.params.id as string;
  const { 
    name, phone, houseNumber, street, area, city, 
    district, state, country, postalCode, latitude, longitude, isDefault 
  } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email: firebaseUser.email as string } });
    const existing = await prisma.address.findUnique({ where: { id } });
    
    if (!existing || existing.userId !== user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        name,
        phone,
        houseNumber,
        street,
        area,
        city,
        district,
        state,
        country,
        postalCode,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        isDefault: isDefault || false
      }
    });
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update address' });
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const id = req.params.id as string;

  try {
    const user = await prisma.user.findUnique({ where: { email: firebaseUser.email as string } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      }),
      prisma.address.update({
        where: { id, userId: user.id },
        data: { isDefault: true }
      })
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set default address' });
  }
};

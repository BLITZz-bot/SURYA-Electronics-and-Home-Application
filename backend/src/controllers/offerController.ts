import { Request, Response } from 'express';
import prisma from '../prisma';

export const getOffers = async (req: Request, res: Response) => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

export const getActiveOffers = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const offers = await prisma.offer.findMany({
      where: {
        status: 'active',
        startDate: { lte: now },
        endDate: { gte: now }
      }
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active offers' });
  }
};

export const createOffer = async (req: Request, res: Response) => {
  try {
    const { title, description, type, startDate, endDate, status } = req.body;
    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'active'
      }
    });
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create offer' });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, type, startDate, endDate, status } = req.body;
    const offer = await prisma.offer.update({
      where: { id },
      data: {
        title,
        description,
        type,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status
      }
    });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update offer' });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.offer.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete offer' });
  }
};

import { Request, Response } from 'express';
import prisma from '../prisma';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" }
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: "default" }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    delete data.id;

    const settings = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

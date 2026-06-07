import { Request, Response } from 'express';
import prisma from '../prisma';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, image } = req.body;
    const category = await prisma.category.create({
      data: { name, slug, image },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, image } = req.body;
    const category = await prisma.category.update({
      where: { id: id as string },
      data: { name, slug, image },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productCount = await prisma.product.count({
      where: { categoryId: id as string }
    });
    if (productCount > 0) {
      return res.status(400).json({ error: 'Cannot delete category with products' });
    }
    await prisma.category.delete({
      where: { id: id as string },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

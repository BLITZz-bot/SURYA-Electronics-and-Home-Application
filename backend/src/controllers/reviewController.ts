import { Request, Response } from 'express';
import prisma from '../prisma';

export const createReview = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const { productId, rating, title, description, images } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: firebaseUser.email }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if user has purchased the product
    const order = await prisma.order.findFirst({
      where: {
        userId: user.id,
        status: 'delivered',
        items: {
          some: { productId }
        }
      }
    });

    const isVerified = !!order;

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: parseInt(rating),
        title,
        description,
        images: images || [],
        isVerified
      },
      include: {
        user: { select: { name: true, image: true } }
      }
    });

    res.status(201).json(review);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const voteHelpful = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const { reviewId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: firebaseUser.email }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const vote = await prisma.reviewHelpful.upsert({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id
        }
      },
      create: {
        reviewId,
        userId: user.id
      },
      update: {} // Do nothing if already voted
    });

    res.json(vote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to vote' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: firebaseUser.email }
    });

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review || (review.userId !== user?.id && user?.role !== 'admin')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.review.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

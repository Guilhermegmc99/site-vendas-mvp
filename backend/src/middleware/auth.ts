import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/database';
import { createError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Token de acesso não fornecido', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    
    if (!process.env.JWT_SECRET) {
      throw createError('JWT secret não configurado', 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      throw createError('Usuário não encontrado', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Token inválido', 401));
    } else {
      next(error);
    }
  }
};

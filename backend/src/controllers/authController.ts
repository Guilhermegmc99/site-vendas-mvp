import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { createError } from '../middleware/errorHandler';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400);
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw createError('Credenciais inválidas', 401);
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw createError('Credenciais inválidas', 401);
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400);
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw createError('Email já está em uso', 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      throw createError('Usuário não encontrado', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

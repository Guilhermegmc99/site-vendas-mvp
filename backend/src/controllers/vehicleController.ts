import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { generateUniqueSlug } from '../utils/slug';

export const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400);
    }

    const {
      title,
      price,
      year,
      mileageKm,
      transmission,
      fuel,
      color,
      location,
      description,
      plate
    } = req.body;

    const slug = await generateUniqueSlug(title, async (slug) => {
      const existing = await prisma.vehicle.findUnique({ where: { slug } });
      return !!existing;
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: req.user!.id,
        title,
        slug,
        price: parseFloat(price),
        year: parseInt(year),
        mileageKm: parseInt(mileageKm),
        transmission,
        fuel,
        color,
        location,
        description,
        plate: plate || null
      },
      include: {
        images: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      message: 'Veículo criado com sucesso',
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      status,
      search,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuel,
      transmission,
      plate,
      page = '1',
      limit = '12'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      userId: req.user!.id
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    if (minYear) where.year = { ...where.year, gte: parseInt(minYear as string) };
    if (maxYear) where.year = { ...where.year, lte: parseInt(maxYear as string) };
    if (fuel) where.fuel = fuel;
    if (transmission) where.transmission = transmission;
    if (plate) where.plate = { contains: plate as string, mode: 'insensitive' };

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          images: {
            orderBy: { position: 'asc' }
          },
          _count: {
            select: { leads: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.vehicle.count({ where })
    ]);

    res.json({
      vehicles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicVehicles = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuel,
      transmission,
      page = '1',
      limit = '12'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      status: 'ACTIVE'
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    if (minYear) where.year = { ...where.year, gte: parseInt(minYear as string) };
    if (maxYear) where.year = { ...where.year, lte: parseInt(maxYear as string) };
    if (fuel) where.fuel = fuel;
    if (transmission) where.transmission = transmission;

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          images: {
            orderBy: { position: 'asc' }
          },
          user: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.vehicle.count({ where })
    ]);

    res.json({
      vehicles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const isAuthenticated = !!req.user;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { position: 'asc' }
        },
        user: {
          select: { id: true, name: true }
        },
        _count: {
          select: { leads: true }
        }
      }
    });

    if (!vehicle) {
      throw createError('Veículo não encontrado', 404);
    }

    // Se não está autenticado ou não é o dono, ocultar placa e verificar se está ativo
    if (!isAuthenticated || vehicle.userId !== req.user?.id) {
      if (vehicle.status !== 'ACTIVE') {
        throw createError('Veículo não encontrado', 404);
      }
      // Remove campo plate da resposta
      const { plate, ...vehicleWithoutPlate } = vehicle;
      return res.json({ vehicle: vehicleWithoutPlate });
    }

    res.json({ vehicle });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400);
    }

    const { id } = req.params;
    const {
      title,
      price,
      year,
      mileageKm,
      transmission,
      fuel,
      color,
      location,
      description,
      plate,
      status
    } = req.body;

    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!existingVehicle) {
      throw createError('Veículo não encontrado', 404);
    }

    if (existingVehicle.userId !== req.user!.id) {
      throw createError('Não autorizado', 403);
    }

    let slug = existingVehicle.slug;
    if (title && title !== existingVehicle.title) {
      slug = await generateUniqueSlug(title, async (newSlug) => {
        if (newSlug === existingVehicle.slug) return false;
        const existing = await prisma.vehicle.findUnique({ where: { slug: newSlug } });
        return !!existing;
      });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        title,
        slug,
        price: price ? parseFloat(price) : undefined,
        year: year ? parseInt(year) : undefined,
        mileageKm: mileageKm ? parseInt(mileageKm) : undefined,
        transmission,
        fuel,
        color,
        location,
        description,
        plate,
        status
      },
      include: {
        images: {
          orderBy: { position: 'asc' }
        }
      }
    });

    res.json({
      message: 'Veículo atualizado com sucesso',
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) {
      throw createError('Veículo não encontrado', 404);
    }

    if (vehicle.userId !== req.user!.id) {
      throw createError('Não autorizado', 403);
    }

    await prisma.vehicle.delete({
      where: { id }
    });

    res.json({
      message: 'Veículo excluído com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

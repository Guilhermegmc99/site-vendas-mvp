import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { Request } from '../middleware/auth';
import crypto from 'crypto';

export const createLead = async (
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
      vehicleId,
      clientName,
      utmSource,
      utmMedium,
      utmCampaign
    } = req.body;

    // Verificar se o veículo existe e está ativo
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, status: true, title: true }
    });

    if (!vehicle) {
      throw createError('Veículo não encontrado', 404);
    }

    if (vehicle.status !== 'ACTIVE') {
      throw createError('Veículo não está disponível', 400);
    }

    // Hash do IP para privacidade (LGPD)
    const clientIp = req.ip || req.connection.remoteAddress || '';
    const ipHashed = clientIp ? crypto.createHash('sha256').update(clientIp).digest('hex') : null;

    const lead = await prisma.lead.create({
      data: {
        vehicleId,
        clientName: clientName || null,
        referrer: req.get('Referer') || null,
        utmSource: utmSource || 'site_vendas',
        utmMedium: utmMedium || 'whatsapp_cta',
        utmCampaign: utmCampaign || 'default',
        ipHashed,
        userAgent: req.get('User-Agent') || null
      },
      include: {
        vehicle: {
          select: {
            id: true,
            title: true,
            slug: true,
            user: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Lead registrado com sucesso',
      lead: {
        id: lead.id,
        vehicleId: lead.vehicleId,
        vehicleTitle: lead.vehicle.title,
        createdAt: lead.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      vehicle: {
        userId: req.user!.id
      }
    };

    if (vehicleId) {
      where.vehicleId = vehicleId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          vehicle: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              year: true,
              color: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.lead.count({ where })
    ]);

    res.json({
      leads,
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

export const getLeadStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    // Leads dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalLeads,
      leadsLast30Days,
      topVehicles,
      leadsBySource
    ] = await Promise.all([
      // Total de leads
      prisma.lead.count({
        where: {
          vehicle: { userId }
        }
      }),
      
      // Leads dos últimos 30 dias
      prisma.lead.count({
        where: {
          vehicle: { userId },
          createdAt: { gte: thirtyDaysAgo }
        }
      }),

      // Top 5 veículos com mais leads
      prisma.lead.groupBy({
        by: ['vehicleId'],
        where: {
          vehicle: { userId }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      }),

      // Leads por fonte
      prisma.lead.groupBy({
        by: ['utmSource'],
        where: {
          vehicle: { userId }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      })
    ]);

    // Buscar detalhes dos veículos top
    const vehicleIds = topVehicles.map(item => item.vehicleId);
    const vehicles = await prisma.vehicle.findMany({
      where: { id: { in: vehicleIds } },
      select: { id: true, title: true, slug: true }
    });

    const topVehiclesWithDetails = topVehicles.map(item => ({
      vehicle: vehicles.find(v => v.id === item.vehicleId),
      leadCount: item._count.id
    }));

    res.json({
      stats: {
        totalLeads,
        leadsLast30Days,
        topVehicles: topVehiclesWithDetails,
        leadsBySource: leadsBySource.map(item => ({
          source: item.utmSource,
          count: item._count.id
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

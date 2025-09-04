import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { createLead, getLeads, getLeadStats } from '../controllers/leadController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Rate limiting para criação de leads (previne spam)
const leadCreationLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // máximo 5 leads por IP por minuto
  message: {
    error: 'Muitas tentativas de contato. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation rules
const leadValidation = [
  body('vehicleId')
    .isUUID()
    .withMessage('ID do veículo deve ser válido'),
  body('clientName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do cliente deve ter entre 2 e 100 caracteres'),
  body('utmSource')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('UTM Source deve ter no máximo 50 caracteres'),
  body('utmMedium')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('UTM Medium deve ter no máximo 50 caracteres'),
  body('utmCampaign')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('UTM Campaign deve ter no máximo 50 caracteres')
];

// Public routes (não precisam de autenticação)
router.post('/', leadCreationLimit, leadValidation, createLead);

// Protected routes (precisam de autenticação)
router.use(authenticate);

router.get('/', getLeads);
router.get('/stats', getLeadStats);

export default router;

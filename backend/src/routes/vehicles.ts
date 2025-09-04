import { Router } from 'express';
import { body } from 'express-validator';
import {
  createVehicle,
  getVehicles,
  getPublicVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Validation rules
const vehicleValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Título deve ter entre 5 e 200 caracteres'),
  body('price')
    .isNumeric({ no_symbols: false })
    .custom(value => value > 0)
    .withMessage('Preço deve ser um número positivo'),
  body('year')
    .isInt({ min: 1980, max: new Date().getFullYear() + 1 })
    .withMessage(`Ano deve estar entre 1980 e ${new Date().getFullYear() + 1}`),
  body('mileageKm')
    .isInt({ min: 0, max: 1000000 })
    .withMessage('Quilometragem deve ser um número entre 0 e 1.000.000'),
  body('transmission')
    .isIn(['Manual', 'Automática', 'CVT', 'Automatizada'])
    .withMessage('Transmissão deve ser Manual, Automática, CVT ou Automatizada'),
  body('fuel')
    .isIn(['Gasolina', 'Álcool', 'Flex', 'Diesel', 'GNV', 'Híbrido', 'Elétrico'])
    .withMessage('Combustível deve ser válido'),
  body('color')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Cor deve ter entre 2 e 50 caracteres'),
  body('location')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Localização deve ter entre 5 e 100 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
  body('plate')
    .optional()
    .trim()
    .matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/)
    .withMessage('Placa deve estar no formato ABC1234 ou ABC1D23')
];

const updateVehicleValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Título deve ter entre 5 e 200 caracteres'),
  body('price')
    .optional()
    .isNumeric({ no_symbols: false })
    .custom(value => !value || value > 0)
    .withMessage('Preço deve ser um número positivo'),
  body('year')
    .optional()
    .isInt({ min: 1980, max: new Date().getFullYear() + 1 })
    .withMessage(`Ano deve estar entre 1980 e ${new Date().getFullYear() + 1}`),
  body('mileageKm')
    .optional()
    .isInt({ min: 0, max: 1000000 })
    .withMessage('Quilometragem deve ser um número entre 0 e 1.000.000'),
  body('transmission')
    .optional()
    .isIn(['Manual', 'Automática', 'CVT', 'Automatizada'])
    .withMessage('Transmissão deve ser Manual, Automática, CVT ou Automatizada'),
  body('fuel')
    .optional()
    .isIn(['Gasolina', 'Álcool', 'Flex', 'Diesel', 'GNV', 'Híbrido', 'Elétrico'])
    .withMessage('Combustível deve ser válido'),
  body('color')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Cor deve ter entre 2 e 50 caracteres'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Localização deve ter entre 5 e 100 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
  body('plate')
    .optional()
    .trim()
    .matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/)
    .withMessage('Placa deve estar no formato ABC1234 ou ABC1D23'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'SOLD'])
    .withMessage('Status deve ser ACTIVE, INACTIVE ou SOLD')
];

// Public routes (não precisam de autenticação)
router.get('/public', getPublicVehicles);
router.get('/public/:id', getVehicleById);

// Protected routes (precisam de autenticação)
router.use(authenticate); // Todas as rotas abaixo precisam de autenticação

router.post('/', vehicleValidation, createVehicle);
router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicleValidation, updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;

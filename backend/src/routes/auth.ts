import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, me } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Senha deve ter entre 6 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra minúscula, maiúscula e um número')
];

// Routes
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.get('/me', authenticate, me);

export default router;

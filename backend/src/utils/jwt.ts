import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está configurado');
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

export const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está configurado');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

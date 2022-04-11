import express from 'express';

import { body } from 'express-validator';
import { validate as validation } from '../middleware/validator.js';
import * as authController from '../controller/auth.js'
import { isAuth } from '../middleware/auth.js';



const router = express.Router();

const validateCredential = [
  body('username').trim().notEmpty().isLength({ min: 5 }).withMessage('usename should be at least 5 characters'),
  body('password').trim().isLength({ min: 5 }).withMessage('password should be at least 5 characters'),
  validation
];

const validateSingup = [
  ...validateCredential,
  body('name').notEmpty().withMessage('name is missing'),
  body('email').isEmail().normalizeEmail().withMessage('invalid email'),
  body('url').isURL().withMessage('invalid URL').optional({ nullable: true, checkFalsy: true }), // nullable: null 허용, checkFalsy: 빈 문자열 허용
  validation
];

router.post('/signup', validateSingup,  authController.signup);

router.post('/login', validateCredential, authController.login);

router.post('/logout', authController.logout);

router.get('/me', isAuth, authController.me);




export default router;

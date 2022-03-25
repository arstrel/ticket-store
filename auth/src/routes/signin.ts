import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@sbsoftworks/gittix-common';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const isCorrectPassword = await Password.compare(
      existingUser.password,
      password
    );

    if (!isCorrectPassword) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign(
      { email, id: existingUser.id },
      process.env.JWT_KEY! // we check that this exists at the app start
    );

    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };

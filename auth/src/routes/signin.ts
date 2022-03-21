import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { User, UserAttrs } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';
import { validateRequest } from '../middlewares/validate-request';

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

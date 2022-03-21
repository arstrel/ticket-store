import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User, UserAttrs } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const userDoc = new User<UserAttrs>({
      email,
      password,
    });
    const user = await userDoc.save();

    // Generate JWT
    const userJwt = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_KEY as string // we check that this exist at the app start
    );

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };

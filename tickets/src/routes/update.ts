import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError, validateRequest } from '@sbsoftworks/gittix-common';
import { body } from 'express-validator';
import { requireAuth } from '@sbsoftworks/gittix-common';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Must provide a title'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be more thatn 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    Ticket.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        price: req.body.price,
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.status(500).send(err.message);
        }

        res.status(200).json(result);
      }
    );
  }
);

export { router as updateTicketRouter };

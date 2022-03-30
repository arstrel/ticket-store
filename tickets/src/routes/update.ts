import express, { Request, Response } from 'express';
import { Ticket, TicketAttrs } from '../models/ticket';
import { NotFoundError } from '@sbsoftworks/gittix-common';

import { requireAuth } from '@sbsoftworks/gittix-common';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
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

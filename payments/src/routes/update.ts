import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
    NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validationRequest,
} from "@ticketingxnie/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-update-publish";
import { natsWrapper } from "../nats-wrappers";
const router = express.Router();

router.put(
  `/api/tickets/:id`,
  requireAuth,[
    body('title').not().isEmpty().withMessage("Title is required"),
    body('price').isFloat({gt:0}).withMessage("Price must greater than 0"),
  ],validationRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }
    
    if (ticket.orderId) {
      throw new BadRequestError("Can not edit a reserved ticket");
    }
    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })

    res.send(ticket)
  }
);

export { router as updateTicketRouter };

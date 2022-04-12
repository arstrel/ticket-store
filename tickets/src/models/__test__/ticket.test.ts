import { Ticket, TicketAttrs } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a ticket
  const ticket = await Ticket.create<TicketAttrs>({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ title: 'updated concert title' });
  secondInstance!.set({ title: 'second updated title' });

  // save the first fetched ticket (should work)
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = await Ticket.create<TicketAttrs>({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  expect(ticket.version).toEqual(0);

  ticket.set({ title: 'updated title' });
  await ticket.save();
  expect(ticket.version).toEqual(1);

  ticket.set({ price: 10 });
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

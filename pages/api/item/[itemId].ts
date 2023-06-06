import { prisma } from '@/lib/db';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import z from 'zod';
import { NextApiRequestWithUser, getUser } from '@/middlewares/user';

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();
router.use(getUser);

router.get(async (req, res) => {
  const { itemId } = req.query;

  if (typeof itemId !== 'string')
    return res.status(400).send('ItemId is not a string.');

  if (!req.user?.user) return res.status(400).send('Not Authorized');

  const getItemWithComments = await prisma.items
    .findFirst({
      where: {
        id: itemId,
      },
      select: {
        name: true,
        category: true,
        image: {
          select: {
            internalName: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            dateCreated: true,
            dateUpdated: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            dateCreated: 'desc',
          },
        },
        storageLocation: true,
        itemType: true,
        dateOfPurchase: true,
        dateCreated: true,
        dateUpdated: true,
      },
    })
    .catch((err) => {
      return null;
    });

  if (!getItemWithComments) return res.status(404).send('Item not found');

  return res.status(200).send(getItemWithComments);
});

router.use(async (req, res, next) => {
  // Gets itemId and user session
  const itemId = z.string().parse(req.query.itemId);

  // If user not logged in, return 401
  if (!req.user) {
    return res.status(401).send('Not logged in');
  }

  // If user is ADMIN, continue
  if (req.user.user.role === 'ADMIN') {
    return next();
  }

  // Tries to find a item that matches user's ID and itemID
  const findItem = await prisma.items.findFirst({
    where: {
      AND: {
        userId: req.user.user.userId,
        id: itemId,
      },
    },
  });

  // If findItem is null, return 401
  if (!findItem) {
    return res.status(401).send('Not Authorized');
  }

  next();
});

router.put(async (req, res) => {
  const itemId = z.string().parse(req.query.itemId);
  const { itemType, dateOfPurchase, storageLocation } = req.body;

  const updateItem = await prisma.items.update({
    where: {
      id: itemId,
    },
    data: {
      itemType: itemType,
      dateOfPurchase: dateOfPurchase,
      storageLocation: storageLocation,
      dateUpdated: new Date(),
    },
  });

  res.status(200).send('Item Updated');
});

router.delete(async (req, res) => {
  const itemId = z.string().parse(req.query.itemId);

  const deleteItem = await prisma.items.delete({
    where: {
      id: itemId,
    },
  });

  res.status(200).send('Item Deleted!');
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

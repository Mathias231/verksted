import { prisma } from '@/lib/db';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { z } from 'zod';
import { NextApiRequestWithUser, getUser } from '@/middlewares/user';

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.get(async (req, res) => {
  const take = z.string().parse(req.query.take);
  const skip = z.string().parse(req.query.skip);

  const getItem = await prisma.items.findMany({
    select: {
      id: true,
      category: true,
      name: true,
      itemType: true,
      image: {
        select: {
          internalName: true,
        },
      },
      dateOfPurchase: true,
      storageLocation: true,
      dateCreated: true,
      dateUpdated: true,
    },
    take: parseInt(take),
    skip: parseInt(skip),
  });
  const totalAmount = await prisma.items.count();

  res.status(200).send({ item: getItem, totalAmount });
});

// Finds user and puts it inside req object
router.use(getUser);

router.post(async (req, res) => {
  // If user is not logged in, return 401
  if (!req.user) return res.status(401).send('Not logged in');

  if (req.user.user.role !== 'ADMIN')
    return res.status(401).send('Not Authorized');

  const {
    workshopId,
    category,
    name,
    itemType,
    dateOfPurchase,
    storageLocation,
    imageId,
  } = req.body;

  const createItem = await prisma.items.create({
    data: {
      userId: req.user?.user.userId,
      workshopId: workshopId,
      category: category,
      name: name,
      itemType: itemType,
      dateOfPurchase: dateOfPurchase,
      storageLocation: storageLocation,
      imageId: imageId,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    },
  });

  res.status(200).send('Item Created!');
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

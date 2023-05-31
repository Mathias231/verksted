import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  const {
    userId,
    workshopId,
    category,
    itemType,
    dateOfPurchase,
    storageLocation,
    imageId,
  } = req.body;

  const createItem = await prisma.items.create({
    data: {
      userId: userId,
      workshopId: workshopId,
      category: category,
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

// router.get(async (req, res) => {
//   const getCategory = await prisma.items.findMany({
//     select: {
//       id: true,
//       userId: true,
//       workshopId: true,
//       category: true,
//       itemType: true,
//       // imageId: true,
//       dateOfPurchase: true,
//       storageLocation: true,
//       dateCreated: true,
//       dateUpdated: true,
//     },
//   });

//   res.status(200).send(getCategory);
// });

router.put(async (req, res) => {
  const { itemId, itemType, dateOfPurchase, storageLocation } = req.body;

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

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const { itemId } = req.query;

  if (typeof itemId !== 'string')
    return res.status(400).send('ItemId is not a string.');

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
      return err;
    });

  if (!getItemWithComments) return res.status(404).send('Item not found');

  return res.status(200).send(getItemWithComments);
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

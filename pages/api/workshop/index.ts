import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  const { workshopName } = req.body;

  const createWorkshop = await prisma.workshop.create({
    data: {
      name: workshopName,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    },
  });

  res.status(200).send('Workshop Created!');
});

router.get(async (req, res) => {
  const getWorkshop = await prisma.workshop.findFirst({
    include: {
      items: true,
    },
  });

  res.status(200).send(getWorkshop);
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

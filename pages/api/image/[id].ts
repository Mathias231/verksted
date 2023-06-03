import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import fs from 'fs';
const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(async (req, res) => {
  const { id } = req.query;

  if (typeof id !== 'string')
    return res.status(400).send('id is not a string.');

  const image = await prisma.image
    .findFirst({
      where: {
        internalName: id,
      },
    })
    .catch((err) => {
      res.status(404).send(err);
    });

  if (!image) return res.status(404).send('No image found');

  const buffer = fs.readFileSync(image.path);
  res.send(buffer);
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

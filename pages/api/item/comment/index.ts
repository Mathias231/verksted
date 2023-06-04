import { prisma } from '@/lib/db';
import { NextApiRequestWithUser, getUser } from '@/middlewares/user';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

// Finds user and puts it inside req object
router.use(getUser);

router.post(async (req, res) => {
  const { itemId, content } = req.body;
  console.log(itemId, content);
  if (!req.user) return res.status(401).send('Ikke logget inn');

  if (req.user.user.role !== 'ADMIN')
    return res.status(401).send('Ikke autorisert');

  const createComment = await prisma.comments.create({
    data: {
      userId: req.user.user.userId,
      itemsId: itemId,
      content,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    },
  });

  res.status(200).send('Kommentar opprettet');
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

import { prisma } from '@/lib/db';
import { NextApiRequestWithUser, getUser } from '@/middlewares/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

// Finds user and puts it inside req object
router.use(getUser);

router.post(async (req, res) => {
  const { userId, itemId, content } = req.body;

  if (!req.user) return res.status(401).send('Not logged in');

  if (req.user.user.role !== 'ADMIN')
    return res.status(401).send('Not Authorized');

  const createComment = await prisma.comments.create({
    data: {
      userId: req.user.user.userId,
      itemsId: itemId,
      content,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    },
  });

  res.status(200).send('Comment Created!');
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

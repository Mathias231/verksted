import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  const { userId, itemId, content } = req.body;

  const createComment = await prisma.comments.create({
    data: {
      userId: userId,
      itemsId: itemId,
      content,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    },
  });

  res.status(200).send('Comment Created!');
});

router.put(async (req, res) => {
  const { commentId, content } = req.body;

  const updateComment = await prisma.comments.update({
    where: {
      id: commentId,
    },
    data: { content: content, dateUpdated: new Date() },
  });

  res.status(200).send('Comment Updated!');
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

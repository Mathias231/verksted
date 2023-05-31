import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import z from 'zod';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.delete(async (req, res) => {
  const commentId = z.string().parse(req.query.commentId);

  const deleteComment = await prisma.comments.delete({
    where: {
      id: commentId,
    },
  });

  res.status(200).send('Comment Deleted!');
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

import { prisma } from '@/lib/db';
import { NextApiRequestWithUser, getUser } from '@/middlewares/user';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import z from 'zod';

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(getUser);
// Finds user and puts it inside req object
router.use(async (req, res, next) => {
  // Gets commentId and user session
  const commentId = z.string().parse(req.query.commentId);

  // If user not logged in, return 401
  if (!req.user) {
    return res.status(401).send('Not logged in');
  }

  // Tries to find a comment that matches user's ID and commentId
  const findComment = await prisma.comments.findFirst({
    where: {
      AND: {
        userId: req.user.user.userId,
        id: commentId,
      },
    },
  });

  // If findComment is null, return 401
  if (!findComment) {
    return res.status(401).send('Not Authorized');
  }

  next();
});

router.delete(async (req, res) => {
  const commentId = z.string().parse(req.query.commentId);

  if (typeof commentId !== 'string')
    return res.status(400).send('CommentID is not a string.');

  const deleteComment = await prisma.comments.delete({
    where: {
      id: commentId,
    },
  });

  res.status(200).send('Comment Deleted!');
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

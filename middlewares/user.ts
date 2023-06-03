import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';

// Adding user session by exnending NextApiRequest
export interface NextApiRequestWithUser extends NextApiRequest {
  user?: Session;
}

export let getUser = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: NextHandler,
) => {
  // Get user session and put it to req.user
  let user = (await getServerSession(req, res, authOptions)) || undefined;

  // Sets req.user
  req.user = user;
  next();
};

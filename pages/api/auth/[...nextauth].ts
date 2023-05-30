import NextAuth from 'next-auth/next';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/db';

if (!process.env.GITHUB_ID) throw new Error('GITHUB_ID Missing');
if (!process.env.GITHUB_SECRET) throw new Error('GITHUB_ID Missing');

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  // Adding admin & userId to session
  callbacks: {
    // Updating session on client with columns from database. Right now its only "WhiteListed" (true or false)
    async session({ session }) {
      // Finds user by email
      const userData = await prisma.user.findFirst({
        where: {
          email: session.user?.email,
        },
      });
      // Updates session by adding whiteListed - boolean
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          admin: userData?.admin,
          userId: userData?.id,
        },
      };

      // DefaultSession (just in case)
      const defaultSession = {
        user: {
          name: '',
          email: '',
          image: '',
        },
        expires: '',
      };
      // Sets result as updatedSession. Sets defaultSession if something goes wrong
      const result = updatedSession || defaultSession;
      return result;
    },
  },
});

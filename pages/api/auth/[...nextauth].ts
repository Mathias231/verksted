import NextAuth from 'next-auth/next';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/db';
import { AuthOptions } from 'next-auth';

// Throw error if ID or SECRET is missing
if (!process.env.GITHUB_ID) throw new Error('GITHUB_ID Missing');
if (!process.env.GITHUB_SECRET) throw new Error('GITHUB_SECRET Missing');
if (!process.env.GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID Missing');
if (!process.env.GOOGLE_CLIENT_SECRET)
  throw new Error('GOOGLE_CLIENT_SECRET Missing');

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Adding role & userId to session
  callbacks: {
    // Updating session on client with columns from database
    async session({ session }) {
      // Finds user by email
      const userData = await prisma.user.findFirst({
        where: {
          email: session.user?.email,
        },
      });
      // Updates session by role and userId
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          role: userData?.role,
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
};
export default NextAuth(authOptions);

import NextAuth from 'next-auth/next';
import GithubProvider from 'next-auth/providers/github';

if (!process.env.GITHUB_ID) throw new Error('GITHUB_ID Missing');
if (!process.env.GITHUB_SECRET) throw new Error('GITHUB_ID Missing');

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});

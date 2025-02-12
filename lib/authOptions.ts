// lib/authOptions.ts
import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/db/connection";
import EcomUser from "@/models/ecomUser";

// Extend the NextAuth User type
export interface ExtendedUser extends NextAuthUser {
  id: string;
  username: string;
}

// Extend the session type to include the user ID
export interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        await connectToDatabase();

        const user = await EcomUser.findOne({ email });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Return the user object with id, username, etc.
        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          name: user.username,
          image: null,
        } as ExtendedUser;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      // If token.id isn't present, return the session as is.
      if (!token.id) return session;

      await connectToDatabase();
      const user = await EcomUser.findById(token.id);
      if (!user) return session;

      return {
        ...session,
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          name: user.username,
          image: user.image || null,
        },
      } as ExtendedSession;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image || null;
      }
      return token;
    },
  },
};

import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prismadb";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }
      
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
      
        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }
      
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
      
        if (!isCorrectPassword) {
          throw new Error("Incorrect password");
        }
      
        // Return the user object with required fields
        return {
          id: user.id.toString(),
          name: user.username, // Map username to name
          email: user.email,   // Include email
          image: user.profilep, // Map profilep to image
          type: user.type
        };
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Only check for Google OAuth sign-ins
      if (account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email }
        });

        // If a user exists with this email and has a password (credential-based),
        // prevent the Google sign-in
        if (existingUser?.password) {
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.image,
          type: token.type
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.type = user.type
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
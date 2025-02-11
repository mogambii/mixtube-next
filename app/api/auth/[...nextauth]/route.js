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
      if (account.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email }
          });

          // If user doesn't exist, create a new one
          if (!existingUser) {
            // Generate a username from the email
            const baseUsername = profile.email.split('@')[0];
            let username = baseUsername;
            let counter = 1;

            // Check if username exists and generate a unique one
            while (true) {
              const existingUsername = await prisma.user.findUnique({
                where: { username }
              });
              if (!existingUsername) break;
              username = `${baseUsername}${counter}`;
              counter++;
            }

            await prisma.user.create({
              data: {
                email: profile.email,
                username: username,
                profilep: profile.picture || null,
                type: 'user',
                emailVerified: new Date()
              }
            });
          }
          return true;
        } catch (error) {
          console.error("Error in Google sign in:", error);
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
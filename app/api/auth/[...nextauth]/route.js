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
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" }, // login or signup
        username: { label: "Username", type: "text" }, // for signup
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.action) {
          throw new Error("Missing required fields");
        }

        const { email, password, action, username } = credentials;

        if (action === "signup") {
          if (!username) {
            throw new Error("Username is required for signup");
          }

          // Check if user already exists
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [{ email }, { username }],
            },
          });

          if (existingUser) {
            throw new Error(
              existingUser.email === email
                ? "Email already registered"
                : "Username already taken"
            );
          }

          // Create new user
          const hashedPassword = await bcrypt.hash(password, 12);
          const newUser = await prisma.user.create({
            data: {
              email,
              username,
              password: hashedPassword,
              type: "user",
              emailVerified: new Date(),
            },
          });

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.username,
            type: newUser.type,
            image: newUser.profilePicture,
          };
        }

        // Login flow
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("This account uses Google sign-in. Please log in with Google.");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username || user.djName,
          type: user.type,
          image: user.profilePicture,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          if (!profile?.email) {
            throw new Error("Google profile is missing an email");
          }

          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!existingUser) {
            const baseUsername = profile.email.split('@')[0];
            let username = baseUsername;
            let counter = 1;

            // Find unique username
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
                username,
                profilep: profile.picture,
                type: "DJ",
                emailVerified: new Date(),
              }
            });
          }
          return true;
        } catch (error) {
          console.error("Error in Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id,
          type: token.type,
          username: token.username,
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

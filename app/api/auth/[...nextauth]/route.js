import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prismadb";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sendEmailResend } from "@/lib/resend";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          type: "user",
          username: profile.email.split("@")[0],
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }

          const { email, password } = credentials;

          // Login flow
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              username: true,
              type: true,
              profilep: true,
            },
          });

          if (!user) {
            return null;
          }

          if (!user.password) {
            throw new Error(
              "This account uses Google sign-in. Please log in with Google."
            );
          }

          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.username,
            username: user.username,
            type: user.type,
            image: user.profilep,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name ? profile.name : profile.email.split("@")[0],
                username: profile.email.split("@")[0],
                type: "user",
                emailVerified: new Date(),
                image: profile.picture,
              },
            });

            // Send welcome email for new Google sign-ups
            await sendEmailResend(
              {
                to: profile.email,
                subject: "Welcome to MixTapped!",
                html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        font-family: Arial, sans-serif;
                        color: #333;
                        padding: 20px;
                      }
                      .header {
                        background-color: #4F46E5;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 8px 8px 0 0;
                      }
                      .content {
                        background-color: #ffffff;
                        padding: 20px;
                        border: 1px solid #e5e7eb;
                        border-radius: 0 0 8px 8px;
                      }
                      .button {
                        display: inline-block;
                        background-color: #4F46E5;
                        color: white;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        margin: 20px 0;
                      }
                      .footer {
                        text-align: center;
                        color: #6B7280;
                        font-size: 0.875rem;
                        margin-top: 20px;
                      }
                      .feature-list {
                        margin: 20px 0;
                        padding-left: 20px;
                      }
                      .feature-list li {
                        margin: 10px 0;
                        color: #4B5563;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="email-container">
                      <div class="header">
                        <h1>Welcome to MixTapped! 🎵</h1>
                      </div>
                      <div class="content">
                        <p>Hi ${profile.name || profile.email.split("@")[0]},</p>
                        <p>Welcome to the MixTapped community! We're excited to have you on board.</p>
                        <p>You've successfully signed up using your Google account. Here's what you can do next:</p>
                        <ul class="feature-list">
                          <li>Discover amazing mixtapes from talented DJs</li>
                          <li>Create and share your own music collections</li>
                          <li>Connect with other music enthusiasts</li>
                          <li>Get personalized recommendations</li>
                        </ul>
                        <a href="${process.env.NEXTAUTH_URL}" class="button">Start Exploring</a>
                        <p style="color: #6B7280; font-size: 0.875rem;">
                          Get ready to experience music in a whole new way!
                        </p>
                      </div>
                      <div class="footer">
                        <p>This email was sent by MixTapped. Please do not reply to this email.</p>
                      </div>
                    </div>
                  </body>
                </html>
              `,
              },
              "welcome@mixtapped.com"
            );
          }
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.type) {
        token.type = session.type;
      }
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.type = token.type;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

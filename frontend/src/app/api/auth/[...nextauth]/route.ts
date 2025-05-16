import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const api_key = process.env.NEXT_PUBLIC_API

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    const formData = new URLSearchParams();
                    formData.append("username", credentials.email);
                    formData.append("password", credentials.password);

                    const response = await axios.post(
                        `${api_key}/api/auth/token`,
                        formData.toString(),
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        }
                    );

                    const authData = response.data;

                    if (response && authData.access_token) {
                        const userResponse = await fetch(`${api_key}/api/auth/me`, {
                            headers: {
                                "Authorization": `Bearer ${authData.access_token}`,
                            },
                        });

                        const userData = await userResponse.json();

                        if (userResponse.ok && userData) {
                            return {
                                id: userData.id,
                                email: userData.email,
                                name: userData.name,
                                accessToken: authData.access_token,
                            };
                        }
                    }

                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }

        }),
    ],
    pages: {
        signIn: "/sign-in",
        signOut: "/",
        error: "/sign-in",
    },
    callbacks: {
        async jwt({ token, user, account, trigger }) {
            if (user) {
                token.id = user.id as string;
                token.email = user.email as string;
                token.name = user.name as string;
                token.accessToken = user.accessToken as string;

                console.log("JWT updated with new token", {
                    email: user.email,
                    tokenPrefix: (user.accessToken as string).substring(0, 10) + '...'
                });
            }

            if (trigger === "update" && account?.access_token) {
                token.accessToken = account.access_token;
                console.log("JWT token refreshed via update trigger");
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    name: token.name as string,
                    accessToken: token.accessToken as string,
                };
            }
            return session;
        },
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 10 * 60 * 60,
    },
    debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };

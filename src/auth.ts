import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { getSupabaseServer } from "./lib/supabase-server"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                const supabase = getSupabaseServer();

                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (authError) {
                    if (authError.message.includes("Email not confirmed")) {
                        throw new Error("Email chưa được xác thực. Vui lòng kiểm tra hộp thư của bạn.");
                    }
                    return null;
                }

                if (!authData.user) {
                    return null;
                }

                const { data: profile } = await supabase
                    .from('mm_profiles')
                    .select('*')
                    .eq('id', authData.user.id)
                    .single();

                if (profile) {
                    return {
                        id: profile.id,
                        name: profile.full_name,
                        email: email,
                        role: profile.role,
                        image: profile.avatar_url,
                    }
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.name = user.name;
                token.picture = user.image;
            }
            if (trigger === "update" && session) {
                if (session.user?.name) token.name = session.user.name;
                if (session.user?.image) token.picture = session.user.image;
                if (session.user?.role) token.role = session.user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
})

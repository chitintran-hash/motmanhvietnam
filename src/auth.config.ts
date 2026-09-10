import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [], 
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.name = user.name;
                token.picture = user.image;
            }
            if (trigger === "update" && session) {
                token.name = session.user?.name || token.name;
                token.picture = session.user?.image || token.picture;
                token.role = session.user?.role || token.role;
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role as string;
                (session.user as any).id = (token.id || token.sub) as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            const isOnProfile = nextUrl.pathname.startsWith('/profile')
            const isOnLogin = nextUrl.pathname.startsWith('/login')
            const isOnRegister = nextUrl.pathname.startsWith('/register')
            const userRole = (auth?.user as { role?: string } | undefined)?.role

            if (isOnAdmin) {
                if (!isLoggedIn) return false
                if (userRole !== 'admin') {
                    return Response.redirect(new URL('/', nextUrl))
                }
                return true
            }

            if (isOnProfile) {
                if (!isLoggedIn) return false
                return true
            }

            if (isLoggedIn && (isOnLogin || isOnRegister)) {
                const destination = userRole === 'admin' ? '/admin' : '/profile'
                return Response.redirect(new URL(destination, nextUrl))
            }
            return true
        },
    },
} satisfies NextAuthConfig

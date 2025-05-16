import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const isAuthPage =
        request.nextUrl.pathname.startsWith("/sign-in") ||
        request.nextUrl.pathname.startsWith("/sign-up");

    if (isAuthPage) {
        if (token) {
            return NextResponse.redirect(new URL("/projects", request.url));
        }
        return NextResponse.next();
    }

    const isProtectedRoute =
        request.nextUrl.pathname.startsWith("/projects") ||
        request.nextUrl.pathname.startsWith("/profile");

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

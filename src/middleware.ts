import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminMenu = [
  "/client/dashboard",
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const pathname = request.nextUrl.pathname;
  
  if (!token && pathname !== "/auth") return redirectTo(request, "/auth");
  if (token && pathname === "/auth") return redirectTo(request, "/");

  if (token && pathname === "/auth/email-verify") {
    const emailVerified = token.email_verified;
    if(emailVerified || emailVerified !== null) return redirectTo(request, "/");
  };
  if (token) {
    const emailVerified = token.email_verified;
    if ((!emailVerified || emailVerified === null) && pathname !== "/auth/email-verify") return redirectTo(request, "/auth/email-verify");
  };
  
  // const isAdminPath = adminMenu.some((menu) => pathname.startsWith(menu));
  // if (isAdminPath && token?.role != RolesEnum.ADMIN) return redirectTo(request, "/"); 

  return NextResponse.next();
}

function redirectTo(request: NextRequest, url: string) {
  const loginUrl = new URL(url, request.nextUrl.origin);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/auth",
    "/auth/email-verify",
    "/client/:path*",
  ],
}
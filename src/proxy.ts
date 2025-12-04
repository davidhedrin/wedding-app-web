import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { RolesEnum } from "@/generated/prisma";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const pathname = request.nextUrl.pathname;
  
  if (!token && !pathname.startsWith("/auth")) return redirectTo(request, "/auth");
  if (token && pathname.startsWith("/auth")) return redirectTo(request, "/");
  
  if (pathname.startsWith("/client/systems") && token?.role != RolesEnum.ADMIN) return redirectTo(request, "/");

  return NextResponse.next();
}

function redirectTo(request: NextRequest, url: string) {
  const loginUrl = new URL(url, request.nextUrl.origin);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/client/:path*",
  ],
}
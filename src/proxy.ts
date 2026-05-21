import { NextResponse } from "next/server";
import { auth } from "./app/api/auth/auth-setup";

// import { getToken } from "next-auth/jwt";

// export async function proxy(request: NextRequest) {
//   const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
//   const pathname = request.nextUrl.pathname;
  
//   if (!token && !pathname.startsWith("/auth")) return redirectTo(request, "/auth");
//   if (token && pathname.startsWith("/auth")) return redirectTo(request, "/");
  
//   if (pathname.startsWith("/client/systems") && token?.role != "Admin") return redirectTo(request, "/");

//   return NextResponse.next();
// }

// function redirectTo(request: NextRequest, url: string) {
//   const loginUrl = new URL(url, request.nextUrl.origin);
//   return NextResponse.redirect(loginUrl);
// }

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // Belum login
  if (!isLoggedIn && !pathname.startsWith("/auth")) return redirectTo(req, "/auth");

  // Sudah login tapi akses auth page
  if (isLoggedIn && pathname.startsWith("/auth")) return redirectTo(req, "/");

  // Role protection
  if (pathname.startsWith("/client/systems") && req.auth?.user?.role !== "Admin") return redirectTo(req, "/");

  return NextResponse.next();
});

function redirectTo(req: Request, url: string) {
  return NextResponse.redirect(new URL(url, req.url));
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/client/:path*",
  ],
}
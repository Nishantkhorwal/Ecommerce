import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Protect all routes under `/dashboard` (modify as needed)
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login", // Redirect to login page if not authenticated
    },
  }
);

// Apply middleware to specific routes (adjust paths as needed)
export const config = {
  matcher: ["/profile", "/cart","/product/:path*","/list"], // Protect specific routes
};

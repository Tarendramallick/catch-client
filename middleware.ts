export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/companies/:path*",
    "/deals/:path*",
    "/tasks/:path*",
    "/notes/:path*",
    "/analytics/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/workspaces/:path*",
    "/quote/:path*",
    "/recruiting/:path*",
    "/customer-success/:path*",
    "/startup-fundraising/:path*",
  ],
}

import authMiddleware  from "next-auth/middleware";

export default authMiddleware({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};

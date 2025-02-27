// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./options";

// This creates the auth handler with your options
const handler = NextAuth(authOptions);

// Only export the route handlers
export { handler as GET, handler as POST };
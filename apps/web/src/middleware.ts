import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { AUTH_MODE } from "./lib/auth-mode";

// Public routes; everything else requires a signed-in user (Clerk mode only).
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// In mock mode there is no auth to enforce — let every request through.
export default AUTH_MODE === "mock" ? () => undefined : clerk;

export const config = {
  matcher: [
    // Skip Next internals and static files, run on everything else.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

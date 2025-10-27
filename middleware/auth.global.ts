let lastRefreshAt: number | null = null;
const REFRESH_COOLDOWN_MS = 300_000;
 
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth();
 
  const publicRoutes = new Set([
    "/",
    "/combined",
    "/login",
    "/forgotPassword",
    "/resetForgottenPassword"
  ]);
 
  if (publicRoutes.has(to.path)) return;
 
  try {
    if (auth.status.value === "authenticated") {
      const now = Date.now();
      if (!lastRefreshAt || now - lastRefreshAt > REFRESH_COOLDOWN_MS) {
        await auth.refresh().catch(() => {});
        lastRefreshAt = Date.now();
      }
      return;
    }
 
    await auth.refresh();
    lastRefreshAt = Date.now();
 
    //@ts-ignore
    if (auth.status.value !== "authenticated") {
      return navigateTo({ path: "/login", replace: true });
    }
 
    return;
  } catch {
    return navigateTo({ path: "/login", replace: true });
  }
});
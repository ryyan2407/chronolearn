type NavigationState = {
  from?: {
    pathname?: string;
  };
};

export function getPostAuthRedirectTarget(state: NavigationState | null | undefined) {
  const pathname = state?.from?.pathname;

  if (!pathname || pathname === "/login" || pathname === "/register") {
    return "/dashboard";
  }

  return pathname;
}

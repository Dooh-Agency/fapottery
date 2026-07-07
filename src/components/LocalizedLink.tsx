import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps, useLocation } from "react-router-dom";
import { getLanguageFromPathname } from "@/i18n";

const isExternal = (to: string) =>
  /^([a-z]+:)?\/\//i.test(to) || to.startsWith("mailto:") || to.startsWith("tel:") || to.startsWith("#");

export const localizePath = (to: string, currentPathname: string): string => {
  if (isExternal(to)) return to;
  if (getLanguageFromPathname(currentPathname) !== "en") return to;
  if (to === "/") return "/en";
  return to.startsWith("/") ? `/en${to}` : `/en/${to}`;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...props }, ref) => {
  const location = useLocation();
  const localizedTo = typeof to === "string" ? localizePath(to, location.pathname) : to;
  return <RouterLink ref={ref} to={localizedTo} {...props} />;
});

Link.displayName = "LocalizedLink";

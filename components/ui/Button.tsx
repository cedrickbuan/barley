import type { AnchorHTMLAttributes, ReactNode } from "react";

// Colours live only here: Tailwind classes can't reliably override each other via `className`.
const VARIANTS = {
  primary: "bg-cocoa text-cream hover:bg-ink",
  secondary: "border border-current text-cocoa hover:bg-cocoa/10",
  primaryOnDark: "bg-cream text-cocoa hover:bg-crust",
  secondaryOnDark: "border border-current text-cream hover:bg-cream/15",
} as const;

type ButtonProps = {
  href: string;
  variant?: keyof typeof VARIANTS;
  external?: boolean;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

export function Button({ href, variant = "primary", external, children, className = "", ...rest }: ButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

const VARIANTS = {
  primary: "bg-cocoa text-cream hover:bg-ink",
  secondary: "border border-current bg-transparent hover:bg-cocoa/10",
} as const;

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

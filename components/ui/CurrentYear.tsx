"use client";

// A client component: with Cache Components, calling `new Date()` in a server component fails the prerender.
export function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}

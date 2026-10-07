"use client";

import { io } from "next/cache";
import { use } from "react";

/**
 * The current year, read in the browser so it never goes stale in the prerendered page.
 * Cache Components rejects `new Date()` during prerender unless `io()` comes first; render inside <Suspense>.
 */
export function CurrentYear() {
  use(io());
  return <>{new Date().getFullYear()}</>;
}

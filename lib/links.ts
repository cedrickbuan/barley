import type { Address } from "@/content/site";

/** One-line address, skipping any empty parts (e.g. a street not yet confirmed). */
export function formatAddress(a: Address): string {
  return [a.street, a.neighborhood, a.city, `${a.region} ${a.postalCode}`].filter(Boolean).join(", ");
}

export function directionsUrl(a: Address): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formatAddress(a))}`;
}

export function mapEmbedUrl(a: Address): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(formatAddress(a))}&output=embed`;
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

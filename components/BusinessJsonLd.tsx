import { business, hero } from "@/content/site";

/** schema.org Bakery data so search engines can show address, hours and phone. */
export function BusinessJsonLd() {
  const { address } = business;
  const data = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: business.name,
    description: business.tagline,
    image: hero.image.src,
    telephone: business.phoneIntl,
    address: {
      "@type": "PostalAddress",
      ...(address.street ? { streetAddress: address.street } : {}),
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: "US",
    },
    openingHoursSpecification: business.hours.map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: row.dayOfWeek,
      opens: row.opens,
      closes: row.closes,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

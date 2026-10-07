import { CurrentYear } from "@/components/ui/CurrentYear";
import { business } from "@/content/site";
import { formatAddress } from "@/lib/links";

export function Footer() {
  return (
    <footer id="footer" data-section className="bg-cocoa text-cream/85">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl font-semibold text-cream">{business.name}</p>
          <p className="mt-2">{business.tagline}</p>
        </div>
        <div className="space-y-1 md:text-right">
          <p>
            <a href={business.phoneHref} className="hover:underline underline-offset-4">
              {business.phoneDisplay}
            </a>
          </p>
          <p>{formatAddress(business.address)}</p>
          {business.social.length > 0 && (
            <p className="flex gap-4 md:justify-end">
              {business.social.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener" className="hover:underline underline-offset-4">
                  {s.label}
                </a>
              ))}
            </p>
          )}
          <p className="pt-3 text-sm text-cream/60">
            © <CurrentYear /> {business.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

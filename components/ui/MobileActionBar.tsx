import { business } from "@/content/site";
import { directionsUrl } from "@/lib/links";
import { PhoneIcon, PinIcon } from "./icons";

/** Phone-only bar fixed to the bottom of the screen so calling or getting directions is always one tap away. */
export function MobileActionBar() {
  const item = "flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold";
  return (
    <nav
      aria-label="Quick actions"
      data-mobile-bar
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-crust bg-cream/95 pb-[env(safe-area-inset-bottom)] text-cocoa backdrop-blur md:hidden"
    >
      <a href={business.phoneHref} data-cta="call" className={item}>
        <PhoneIcon />
        Call
      </a>
      <a
        href={directionsUrl(business.address)}
        target="_blank"
        rel="noopener"
        data-cta="directions"
        className={`${item} border-l border-crust`}
      >
        <PinIcon />
        Directions
      </a>
    </nav>
  );
}

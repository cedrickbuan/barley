import { business } from "@/content/site";
import { directionsUrl } from "@/lib/links";
import { Button } from "./Button";
import { PhoneIcon, PinIcon } from "./icons";

/** The site's two primary actions, side by side. Use `onDark` over photos or dark backgrounds. */
export function CallDirections({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button
        href={business.phoneHref}
        variant={onDark ? "primaryOnDark" : "primary"}
        data-cta="call"
      >
        <PhoneIcon />
        Call {business.phoneDisplay}
      </Button>
      <Button
        href={directionsUrl(business.address)}
        variant={onDark ? "secondaryOnDark" : "secondary"}
        external
        data-cta="directions"
      >
        <PinIcon />
        Get directions
      </Button>
    </div>
  );
}

import { business } from "@/content/site";
import { directionsUrl } from "@/lib/links";
import { Button } from "./Button";
import { PhoneIcon, PinIcon } from "./icons";

/** The site's two primary actions, side by side. */
export function CallDirections({ className = "", secondaryClassName = "" }: { className?: string; secondaryClassName?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button href={business.phoneHref} data-cta="call">
        <PhoneIcon />
        Call {business.phoneDisplay}
      </Button>
      <Button
        href={directionsUrl(business.address)}
        variant="secondary"
        external
        data-cta="directions"
        className={secondaryClassName}
      >
        <PinIcon />
        Get directions
      </Button>
    </div>
  );
}

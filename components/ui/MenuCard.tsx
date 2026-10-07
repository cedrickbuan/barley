import Image from "next/image";
import type { MenuItem } from "@/content/site";
import { formatPrice } from "@/lib/links";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article data-menu-item className="group flex flex-col overflow-hidden rounded-3xl bg-white/60 ring-1 ring-crust">
      <div className="relative aspect-[4/5] overflow-hidden">
        <div data-menu-parallax className="absolute -inset-y-[10%] inset-x-0">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold text-cocoa">{item.name}</h3>
          <span className="shrink-0 font-semibold text-caramel">{formatPrice(item.price)}</span>
        </div>
        <p className="mt-3 leading-relaxed text-ink/75">{item.description}</p>
      </div>
    </article>
  );
}

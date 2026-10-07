import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const title = "Arley Bakery — Fresh bakes in Pilsen, Chicago";
const description =
  "A neighbourhood bakery in Pilsen, Chicago. Flan, chocolate cookies, cupcakes and more, baked fresh every morning. Visit us or call to order.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/images/store.jpg", width: 2400, height: 1600, alt: "Fresh pastries at Arley Bakery" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

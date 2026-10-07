import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arley Bakery — Fresh bakes in Pilsen, Chicago",
  description:
    "A neighbourhood bakery in Pilsen, Chicago. Flan, chocolate cookies, cupcakes and more, baked fresh every morning. Visit us or call to order.",
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

// All business content for the site lives here. Edit this file to change
// text, hours, prices or photos; components read from it and hold no copy.

export type ImageAsset = { src: string; alt: string; width: number; height: number };

export type Address = {
  street: string;
  neighborhood: string;
  city: string;
  region: string;
  postalCode: string;
};

/** `opens` / `closes` are 24h "HH:MM". */
export type OpeningHours = { days: string; opens: string; closes: string }[];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: ImageAsset;
};

export type ShowcaseSlide = { image: ImageAsset; caption: string };

export const business = {
  name: "Arley Bakery",
  tagline: "Fresh bakes from the heart of Pilsen",
  phoneDisplay: "(773) 222-3333",
  phoneHref: "tel:+17732223333",
  address: {
    street: "", // PLACEHOLDER: street address still to be confirmed by the bakery
    neighborhood: "Pilsen",
    city: "Chicago",
    region: "IL",
    postalCode: "60608",
  } satisfies Address,
  // PLACEHOLDER: opening hours still to be confirmed by the bakery
  hours: [
    { days: "Monday – Friday", opens: "07:00", closes: "18:00" },
    { days: "Saturday", opens: "08:00", closes: "18:00" },
    { days: "Sunday", opens: "08:00", closes: "14:00" },
  ] satisfies OpeningHours,
  social: [] as { label: string; href: string }[],
};

export const hero = {
  headline: "Baked fresh in Pilsen, every morning",
  subhead: "Cookies, cupcakes, flan and more — made by hand, in small batches, with ingredients you can name.",
  image: {
    src: "/images/store.jpg",
    alt: "The Arley Bakery shop counter filled with fresh pastries",
    width: 2400,
    height: 1600,
  },
} satisfies { headline: string; subhead: string; image: ImageAsset };

export const story = {
  heading: "A neighbourhood bakery, the old-fashioned way",
  paragraphs: [
    "Every batch starts before sunrise, in a kitchen you could eat off the floor of. Real butter, real chocolate, and no shortcuts.",
    "We bake in small runs through the day, so what you take home was on a cooling rack not long before.",
    "Stop by for a coffee and something sweet, or call ahead and we'll have your order boxed and ready.",
  ],
  image: {
    src: "/images/hands.jpg",
    alt: "A baker's hands shaping fresh dough on a floured table",
    width: 2400,
    height: 1600,
  },
} satisfies { heading: string; paragraphs: string[]; image: ImageAsset };

export const showcaseHeading = "Made by hand, every morning";

export const showcase: ShowcaseSlide[] = [
  {
    caption: "Flaky. Golden. Out of the oven at dawn.",
    image: { src: "/images/showcase-pastry.jpg", alt: "Close-up of golden, flaky pastries", width: 2400, height: 1600 },
  },
  {
    caption: "Real chocolate, melted the slow way.",
    image: { src: "/images/showcase-chocolate.jpg", alt: "Close-up of chocolate cookies with melted chocolate chunks", width: 2400, height: 1600 },
  },
  {
    caption: "Frosted by hand, one at a time.",
    image: { src: "/images/showcase-cupcakes.jpg", alt: "Close-up of freshly frosted cupcakes", width: 2400, height: 1600 },
  },
];

export const menuHeading = "Our menu";

// PLACEHOLDER: every price is $10.99 on the old site; confirm real prices with the bakery
export const menu: MenuItem[] = [
  {
    id: "flan",
    name: "Flan",
    description: "A 22\" Mexican-style flan with silky caramel. Our customers' favourite.",
    price: 10.99,
    image: { src: "/images/menu-flan.jpg", alt: "A slice of caramel flan on a plate", width: 1200, height: 1200 },
  },
  {
    id: "chocolate-cookies",
    name: "Chocolate Cookies",
    description: "A pack of 12 soft cookies loaded with milk chocolate.",
    price: 10.99,
    image: { src: "/images/menu-cookies.jpg", alt: "A stack of chocolate chip cookies", width: 1200, height: 1200 },
  },
  {
    id: "chocolate-cupcakes",
    name: "Chocolate Cupcakes",
    description: "A pack of 4 soft, rich cupcakes with chocolate frosting.",
    price: 10.99,
    image: { src: "/images/menu-cupcakes.jpg", alt: "Chocolate cupcakes with swirled frosting", width: 1200, height: 1200 },
  },
  {
    id: "gummies",
    name: "Gummies",
    description: "Chewy, fruity gummies made with real fruit juice.",
    price: 10.99,
    image: { src: "/images/menu-gummies.jpg", alt: "A bowl of colourful fruit gummies", width: 1200, height: 1200 },
  },
];

export const galleryHeading = "Inside the bakery";

export const gallery: ImageAsset[] = [
  { src: "/images/girl.jpg", alt: "A customer enjoying a pastry at the bakery", width: 2400, height: 1600 },
  { src: "/images/cupcakes.jpg", alt: "Rows of decorated cupcakes on the counter", width: 2400, height: 1600 },
  { src: "/images/gallery-bread.jpg", alt: "Fresh loaves of bread cooling on a rack", width: 2400, height: 1600 },
  { src: "/images/gallery-croissants.jpg", alt: "A tray of croissants fresh from the oven", width: 2400, height: 1600 },
  { src: "/images/gallery-coffee.jpg", alt: "A coffee and a pastry on a café table", width: 2400, height: 1600 },
  { src: "/images/gallery-cookies.jpg", alt: "Cookies cooling on a baking sheet", width: 2400, height: 1600 },
];

export const visitHeading = "Come and visit";

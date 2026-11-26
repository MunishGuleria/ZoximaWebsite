/* --------------------------------------------------------------------------
   Real product screens (Salezx desks, built by Zoxima), used where a page
   shows the product itself: the home hero and the Products hero.

   Labels are doc copy only: `name` is the solution's name and `title` its
   card line from Home §3 / the solution page H1. Each screen links to the
   solution it shows.
   -------------------------------------------------------------------------- */

export interface ProductScreen {
  name: string
  title: string
  href: string
  src: string
  w: number
  h: number
  alt: string
}

export const PRODUCT_SCREENS: ProductScreen[] = [
  {
    name: "Pricing and quotes",
    title: "The right price, every time",
    href: "/solutions?s=pricing",
    src: "/product/quote-margin.webp",
    w: 1170,
    h: 788,
    alt: "An incoming enquiry turned into a draft quotation from the price sheet, with a margin check recommending the discount to offer",
  },
  {
    name: "Sales productivity",
    title: "Every rep prepared for every customer",
    href: "/solutions?s=sales-productivity",
    src: "/product/priority-actions.webp",
    w: 1060,
    h: 860,
    alt: "A rep's priority actions for the day: open leads, calls, meetings, stale leads and pending quotes, beside the day's meeting schedule",
  },
  {
    name: "Sales reviews and performance",
    title: "Reviews that end in actions",
    href: "/solutions?s=sales-reviews",
    src: "/product/weekly-lead-board.webp",
    w: 1060,
    h: 850,
    alt: "A weekly lead board: new leads, qualified leads, win rate and pipeline by source, with the leads behind one source",
  },
  {
    name: "Service contract renewals",
    title: "Service contracts renewed before they lapse",
    href: "/solutions?s=service-renewals",
    src: "/product/renewals.webp",
    w: 1010,
    h: 830,
    alt: "Service contracts and warranties expiring soon with days left, and the follow-up leads created for them",
  },
]

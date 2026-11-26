import type { MetadataRoute } from "next"

/* Web app manifest: name, colours and icons for "add to home screen" and
   browser UI. Icons are the app/icon.png and app/apple-icon.png files. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zoxima",
    short_name: "Zoxima",
    description: "Applications, automations and AI agents that run sales and service for large enterprises.",
    start_url: "/",
    display: "browser",
    background_color: "#fbfaf8",
    theme_color: "#131720",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // Sets the base path for assets to point to your GitHub repo
    base: "/llift-coffee-seat-tracker/",
  },
  
  // Set Nitro output target to static SSG for GitHub Pages compatibility
  nitro: {
    preset: "static",
  },

  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

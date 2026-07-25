import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/lift-coffee-seat-tracker/",
  },
  nitro: {
    preset: "static",
    prerender: {
      routes: ["/lift-coffee-seat-tracker/"],
      crawlLinks: false,
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});

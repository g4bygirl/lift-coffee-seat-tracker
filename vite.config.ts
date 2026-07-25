import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/lift-coffee-seat-tracker/",
  },
  nitro: {
    preset: "static",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});

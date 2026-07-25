import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {},
  nitro: {
    preset: "static",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});

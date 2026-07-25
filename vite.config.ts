import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {},
  nitro: {
    preset: "static",
    routeRules: {
      "/**": {
        prerender: true,
      },
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});

import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    coverage: {
      include: ["src/**"],
      reporter: ["text", "json", "clover", "html"],
    },
  },
});

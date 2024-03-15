import { defineConfig } from "tsup";

export default defineConfig(options => ({
  format: ["cjs", "esm"],
  sourcemap: false,
  clean: true,
  bundle: true,
  minify: !options.watch,
  legacyOutput: true,
  dts: true,
}));

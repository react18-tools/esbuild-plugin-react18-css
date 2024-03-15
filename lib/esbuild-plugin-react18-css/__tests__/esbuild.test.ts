import fs from "node:fs";
import path from "node:path";
import { describe, test, beforeAll } from "vitest";
import esbuild from "esbuild";
import cssPlugin from "../src";
import glob from "tiny-glob";

describe("Test plugin with esbuild", async () => {
  const exampleBuildDir = path.resolve(process.cwd(), "test-build1");

  beforeAll(async () => {
    await esbuild.build({
      format: "cjs",
      target: "es2019",
      sourcemap: false,
      bundle: true,
      minify: true,
      plugins: [cssPlugin()],
      entryPoints: await glob("../esbuild-plugin-react18-css-example/src/**/*.*"),
      external: ["react", "react-dom"],
      outdir: "./test-build1",
    });
  });

  test(`Test CSS Class Hash`, ({ expect }) => {
    const text = fs.readFileSync(path.resolve(exampleBuildDir, "server", "index.js"), "utf-8");
    expect(/{fork:["'][^"']*fork[^"']*["']/.test(text)).toBe(true);
  });

  test("Should contain -moz-", ({ expect }) => {
    const test = fs.readFileSync(path.resolve(exampleBuildDir, "index.css"), "utf-8");
    expect(/-moz-/.test(test)).toBe(true);
  });
});

describe("Test plugin with esbuild and options", async () => {
  const exampleBuildDir = path.resolve(process.cwd(), "test-build");

  beforeAll(async () => {
    await esbuild.build({
      format: "cjs",
      target: "es2019",
      sourcemap: false,
      bundle: true,
      minify: true,
      plugins: [
        cssPlugin({
          skipAutoPrefixer: true,
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        }),
      ],
      entryPoints: await glob("../esbuild-plugin-react18-css-example/src/**/*.*"),
      publicPath: "https://my.domain/static/",
      external: ["react", "react-dom"],
      outdir: "./test-build",
    });
  });

  test(`Test CSS Class Hash`, ({ expect }) => {
    const text = fs.readFileSync(path.resolve(exampleBuildDir, "server", "index.js"), "utf-8");
    expect(/{fork:["'][^"']*fork[^"']*["']/.test(text)).toBe(true);
  });

  test("Should not contain -moz-", ({ expect }) => {
    const test = fs.readFileSync(path.resolve(exampleBuildDir, "index.css"), "utf-8");
    expect(/-moz-/.test(test)).toBe(false);
  });
});

describe("Only server styles", () => {
  const exampleBuildDir = path.resolve(process.cwd(), "test-build1");

  beforeAll(async () => {
    await esbuild.build({
      format: "cjs",
      target: "es2019",
      sourcemap: false,
      bundle: true,
      minify: true,
      plugins: [cssPlugin()],
      entryPoints: await glob("../example2/src/**/*.*"),
      external: ["react", "react-dom"],
      outdir: "./test-build1",
    });
  });

  test(`Test CSS Class Hash`, ({ expect }) => {
    const text = fs.readFileSync(path.resolve(exampleBuildDir, "server", "index.js"), "utf-8");
    expect(/{fork:["'][^"']*fork[^"']*["']/.test(text)).toBe(true);
  });

  test("Should contain -moz-", ({ expect }) => {
    const test = fs.readFileSync(path.resolve(exampleBuildDir, "index.css"), "utf-8");
    expect(/-moz-/.test(test)).toBe(true);
  });
});

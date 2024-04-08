# esbuild-plugin-react18-css

[![test](https://github.com/react18-tools/esbuild-plugin-react18-css/actions/workflows/test.yml/badge.svg)](https://github.com/react18-tools/esbuild-plugin-react18-css/actions/workflows/test.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/4a09ba9315f3296c1524/maintainability)](https://codeclimate.com/github/react18-tools/esbuild-plugin-react18-css/maintainability) [![codecov](https://codecov.io/gh/react18-tools/esbuild-plugin-react18-css/graph/badge.svg)](https://codecov.io/gh/react18-tools/esbuild-plugin-react18-css) [![Version](https://img.shields.io/npm/v/esbuild-plugin-react18-css.svg?colorB=green)](https://www.npmjs.com/package/esbuild-plugin-react18-css) [![Downloads](https://img.jsdelivr.com/img.shields.io/npm/d18m/esbuild-plugin-react18-css.svg)](https://www.npmjs.com/package/esbuild-plugin-react18-css) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/esbuild-plugin-react18-css) [![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

> [Featured packages built with this template.](./FEATURED.md)

## Features

✅ ESBuild plugin to handle CSS/SCSS modules, autoprefixer, etc.

✅ Create fully treeshakable libraries (import from esbuild-plugin-react18-css/client/component)

✅ Use CSS/SCSS modules - automatically converted to BEM like CSS

✅ fully treeshakable CSS - import only the CSS files your users need

✅ Full TypeScript Support

✅ Unleash the full power of React18 Server components

✅ Works with all build systems/tools/frameworks for React18

✅ Doccumented with [Typedoc](https://react18-tools.github.io/esbuild-plugin-react18-css) ([Docs](https://react18-tools.github.io/esbuild-plugin-react18-css))

## Install

```bash
$ pnpm add esbuild-plugin-react18-css
```

or

```bash
$ npm install esbuild-plugin-react18-css
```

or

```bash
$ yarn add esbuild-plugin-react18-css
```

## use with `tsup`

```ts
// tsup.config.ts or tsup.config.js
import { defineConfig } from "tsup";
import cssPlugin from "esbuild-plugin-react18-css";

export default defineConfig(options => ({
    ...
    esbuildPlugins:[cssPlugin()]
}));
```

## use with esbuild

```ts
import cssPlugin from "esbuild-plugin-react18-css";

esbuild.build({
  ...
  plugins: [cssPlugin()],
});
```

## CSSPluginOptions

```tsx
interface CSSPluginOptions {
  /** by default name is generated without hash so that it is easier and reliable for library users to override some CSS*/
  generateScopedName?: string | ((className: string, filename: string, css: string) => string);
  /** set skipAutoPrefixer to true to disable autoprefixer */
  skipAutoPrefixer?: boolean;
  /** global CSS class prefix. @defaultValue "" */
  globalPrefix?: string;
  /** If you want to keep .module.css files */
  keepModules?: boolean;
}
```

### generateScopedName

It can be a string like `[name]__[local]___[hash:base64:5]` or `[name]__[local]` or `my-prefix__[name]__[local]`

The functions arguments are as follows.

- css: the entire css file content
- className: className from css file for the specific class
- fileName: absolute fileName

### 🤩 Don't forger to star [this repo](https://github.com/react18-tools/esbuild-plugin-react18-css)!

Want hands-on course for getting started with Turborepo? Check out [React and Next.js with TypeScript](https://mayank-chaudhari.vercel.app/courses/react-and-next-js-with-typescript) and [The Game of Chess with Next.js, React and TypeScrypt](https://www.udemy.com/course/game-of-chess-with-nextjs-react-and-typescrypt/?referralCode=851A28F10B254A8523FE)

![Repo Stats](https://repobeats.axiom.co/api/embed/b9f60aadc635649d8a66039094bcb26b5ccea1c1.svg "Repobeats analytics image")

## License

Licensed as MIT open source.

<hr />

<p align="center" style="text-align:center">with 💖 by <a href="https://mayank-chaudhari.vercel.app" target="_blank">Mayank Kumar Chaudhari</a></p>

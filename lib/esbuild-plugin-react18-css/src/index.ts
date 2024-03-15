import { Plugin, PluginBuild } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import autoPrefixer from "autoprefixer";
import { compile } from "sass";

const uuid = () => (Date.now() * Math.random()).toString(36).slice(0, 8);

interface CSSModulePluginOptions {
  generateScopedName?: string | ((name: string, filename: string, css: string) => string);
  skipAutoPrefixer?: boolean;
}

function applyAutoPrefixer(build: PluginBuild, options: CSSModulePluginOptions, write?: boolean) {
  build.onEnd(async result => {
    if (!options.skipAutoPrefixer) {
      for (const f of result.outputFiles?.filter(f => f.path.match(/\.css$/)) || []) {
        const { css } = await postcss([autoPrefixer]).process(f.text, { from: f.path });
        f.contents = new TextEncoder().encode(css);
      }
    }

    /** assume true if undefined */
    if (write === undefined || write) {
      result.outputFiles?.forEach(file => {
        fs.mkdirSync(path.dirname(file.path), { recursive: true });
        fs.writeFileSync(file.path, file.contents);
      });
    }
  });
}

function handleScss(build: PluginBuild) {
  build.onLoad({ filter: /\.scss$/, namespace: "file" }, args => ({
    contents: compile(args.path).css,
    loader: "css",
  }));
}

function handleModules(
  build: PluginBuild,
  { generateScopedName }: CSSModulePluginOptions,
  type: "css" | "scss" = "css",
) {
  const namespace = `${type}-module`;
  const filter = new RegExp(`\\.module\\.${type}$`);
  build.onResolve({ filter, namespace: "file" }, args => ({
    path: `${args.path}#${namespace}`,
    namespace,
    pluginData: {
      pathDir: path.join(args.resolveDir, args.path),
    },
  }));

  build.onLoad({ filter: new RegExp(`#${namespace}$`), namespace }, async args => {
    const { pluginData } = args as {
      pluginData: { pathDir: string };
    };

    const source = compile(pluginData.pathDir).css;

    let cssModule = {};
    const result = await postcss([
      postcssModules({
        getJSON(_, json) {
          cssModule = json;
        },
        generateScopedName,
      }),
    ]).process(source, { from: pluginData.pathDir });

    return {
      pluginData: { css: result.css },
      contents: `import "${pluginData.pathDir}"; export default ${JSON.stringify(cssModule)}`,
    };
  });

  build.onResolve({ filter, namespace }, args => ({
    path: path.join(args.resolveDir, args.path, `#${namespace}-data`),
    namespace,
    pluginData: args.pluginData as { css: string },
  }));

  build.onLoad({ filter: new RegExp(`#${namespace}-data$`), namespace }, args => ({
    contents: (args.pluginData as { css: string }).css,
    loader: "css",
  }));
}

const cssPlugin: (options: CSSModulePluginOptions) => Plugin = (options = {}) => ({
  name: "esbuild-plugin-react18-css-" + uuid(),
  setup(build): void {
    const write = build.initialOptions.write;
    if (!options.generateScopedName) {
      options.generateScopedName = (name, filename) =>
        `${path.basename(filename).split(".")[0]}__${name}`;
    }
    handleModules(build, options);
    handleModules(build, options, "scss");
    handleScss(build);
    applyAutoPrefixer(build, options, write);
  },
});

export = cssPlugin;

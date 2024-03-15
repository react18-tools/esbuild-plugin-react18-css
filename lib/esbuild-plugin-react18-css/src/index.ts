import { BuildResult, Plugin, PluginBuild } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import autoPrefixer from "autoprefixer";
import { compile } from "sass";

const uuid = () => (Date.now() * Math.random()).toString(36).slice(0, 8);

export interface CSSPluginOptions {
  /** by default name is generated without hash so that it is easier and reliable for library users to override some CSS */
  generateScopedName?: string | ((className: string, filename: string, css: string) => string);
  /** set skipAutoPrefixer to true to disable autoprefixer */
  skipAutoPrefixer?: boolean;
  /** global CSS class prefix. @defaultValue "" */
  globalPrefix?: string;
}

function generateCombinedCSS(result: BuildResult) {
  /** generate combined server and client CSS */
  const serverRegExp = new RegExp(`server\\${path.sep}index\\.css`);
  const serverCSSFile = result.outputFiles?.filter(f => f.path.match(serverRegExp))[0];

  const clientRegExp = new RegExp(`client\\${path.sep}index\\.css`);
  const clientCSSFile = result.outputFiles?.filter(f => f.path.match(clientRegExp))[0];

  if (!serverCSSFile && !clientCSSFile) return;

  const combinedCSS = (clientCSSFile?.text ?? "") + (serverCSSFile?.text ?? "");
  let indexCSSFile;
  let indexCSSFilePath: string;
  if (clientCSSFile) {
    indexCSSFilePath = clientCSSFile.path.replace(`client${path.sep}`, "");
    indexCSSFile = result.outputFiles?.filter(f => f.path === indexCSSFilePath)[0];
  } else {
    indexCSSFilePath = serverCSSFile?.path.replace(`server${path.sep}`, "") ?? "";
  }

  if (indexCSSFile) indexCSSFile.contents = new TextEncoder().encode(combinedCSS);
  else
    result.outputFiles?.push({
      path: indexCSSFilePath,
      contents: new TextEncoder().encode(combinedCSS),
      text: combinedCSS,
      hash: uuid(),
    });
}

function applyAutoPrefixer(build: PluginBuild, options: CSSPluginOptions, write?: boolean) {
  build.onEnd(async result => {
    if (!options.skipAutoPrefixer) {
      for (const f of result.outputFiles?.filter(f => f.path.match(/\.css$/)) || []) {
        const { css } = await postcss([autoPrefixer]).process(f.text, { from: f.path });
        f.contents = new TextEncoder().encode(css);
      }
    }

    generateCombinedCSS(result);

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
  build.onLoad({ filter: /\.s(c|a)ss$/, namespace: "file" }, args => ({
    contents: compile(args.path).css,
    loader: "css",
  }));
}

function handleModules(build: PluginBuild, { generateScopedName }: CSSPluginOptions) {
  const namespace = "scss-module";
  const filter = /\.module\.(sc|sa|c)ss/;
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

function resolveScopedName(options: CSSPluginOptions) {
  const globalPrefix = options.globalPrefix ?? "";
  options.generateScopedName = (name, filename) =>
    (globalPrefix ? `${globalPrefix}__` : "") + `${path.basename(filename).split(".")[0]}__${name}`;
}

const cssPlugin: (options?: CSSPluginOptions) => Plugin = (options = {}) => ({
  name: "esbuild-plugin-react18-css-" + uuid(),
  setup(build): void {
    const write = build.initialOptions.write;
    build.initialOptions.write = false;
    if (!options.generateScopedName) resolveScopedName(options);
    handleModules(build, options);
    handleScss(build);
    applyAutoPrefixer(build, options, write);
  },
});

export default cssPlugin;

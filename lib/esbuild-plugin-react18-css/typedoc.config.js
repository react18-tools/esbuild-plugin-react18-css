/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  name: "Code Documentation",
  entryPoints: ["./src"],
  entryPointStrategy: "Expand",
  tsconfig: "./tsconfig.doc.json",
  out: "../../docs",
  commentStyle: "all",
  searchInComments: true,
  plugin: [
    "typedoc-plugin-mdn-links",
    "typedoc-plugin-rename-defaults",
    "typedoc-plugin-missing-exports",
    "typedoc-plugin-zod",
    "typedoc-plugin-inline-sources",
  ],
};

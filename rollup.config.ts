import { builtinModules } from "module";
import type { OutputPlugin, RollupOptions } from "rollup";
import * as fs from "node:fs";
import * as path from "node:path";
import typescript from "@rollup/plugin-typescript";

const pkg = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "package.json"), "utf8"),
);

export default {
  input: "src/index.ts",
  external: Object.keys(pkg.dependencies || {})
    .concat(Object.keys(pkg.peerDependencies || {}))
    .concat(builtinModules),
  onwarn: (warning) => {
    // Ignore circular dependencies warnings
    if (warning.code === "CIRCULAR_DEPENDENCY") return;

    throw Object.assign(new Error(), warning);
  },
  strictDeprecations: true,
  output: [
    {
      format: "cjs",
      file: pkg.main,
      exports: "named",
      footer: "module.exports = Object.assign(exports.default, exports);",
      sourcemap: true,
    },
    {
      format: "es",
      file: pkg.module,
      plugins: [emitModulePackageFile()],
      sourcemap: true,
    },
  ],
  plugins: [typescript({ sourceMap: true })],
} as RollupOptions;

export function emitModulePackageFile(): OutputPlugin {
  return {
    name: "emit-module-package-file",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "package.json",
        source: `{"type":"module"}`,
      });
    },
  };
}

import { defineConfig } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";

export default defineConfig([
  {
    entry: {
      index: "src/index.tsx",
    },
    outDir: "dist",
    format: ["esm"],
    target: "esnext",
    platform: "browser",
    dts: true,
    clean: true,
    splitting: false,
    external: ["solid-js"],
    treeshake: { preset: "safest" },
    esbuildPlugins: [solidPlugin()],
  },
  {
    entry: {
      index: "src/index.tsx",
    },
    outDir: "dist",
    format: ["esm"],
    target: "esnext",
    platform: "browser",
    splitting: false,
    external: ["solid-js"],
    outExtension: () => ({ js: ".jsx" }),
    esbuildOptions(options) {
      options.jsx = "preserve";
    },
  },
]);

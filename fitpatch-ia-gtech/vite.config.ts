import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import fs from "fs";
import path from "path";

// Plugin to allow extensionless or .js imports to resolve .ts/.tsx files
function resolveTsExtensionsPlugin(): Plugin {
  return {
    name: "resolve-ts-extensions",
    resolveId(source, importer) {
      if (!importer || source.startsWith("\0") || source.includes("node_modules")) {
        return null;
      }
      if (source.startsWith(".") || source.startsWith("/")) {
        const dir = path.dirname(importer);
        const basePath = path.resolve(dir, source);
        const candidates = [
          basePath,
          source.endsWith(".js") ? basePath.slice(0, -3) + ".tsx" : null,
          source.endsWith(".js") ? basePath.slice(0, -3) + ".ts" : null,
          basePath + ".tsx",
          basePath + ".ts",
          basePath + ".jsx",
          basePath + ".js",
        ].filter(Boolean) as string[];

        for (const candidate of candidates) {
          if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            return candidate;
          }
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [resolveTsExtensionsPlugin(), react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});

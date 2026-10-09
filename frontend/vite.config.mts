import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import babel from "@rolldown/plugin-babel";

const envRelativePath = "../";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), envRelativePath), "");

  process.env.VITE_BACKEND_PORT = env.BACKEND_PORT;
  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    envDir: envRelativePath,
    resolve: {
      alias: {
        ui: path.resolve(import.meta.dirname, "./src/components/ui"),
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  };
});

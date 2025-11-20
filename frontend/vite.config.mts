import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const envRelativePath = "../";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), envRelativePath), "");

  process.env.VITE_BACKEND_PORT = env.BACKEND_PORT;
  return {
    plugins: [react(), tailwindcss()],
    envDir: envRelativePath,
    resolve: {
      alias: {
        ui: path.resolve(__dirname, "./src/components/ui"),
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

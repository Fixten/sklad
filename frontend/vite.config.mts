import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const envRelativePath = "../";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), envRelativePath), "");

  process.env.VITE_BACKEND_PORT = env.BACKEND_PORT;
  return {
    plugins: [react()],
    envDir: envRelativePath,
  };
});

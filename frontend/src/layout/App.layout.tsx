import { Outlet } from "react-router";

import { isFeatureEnabled } from "@/config/features";
import pathsRouter from "@/router/paths.router";
import Header from "@ui/Header";

import { ThemeProvider } from "./ThemeProvider";

export const navItems = [
  { link: pathsRouter.home, name: "Главная" },
  ...(isFeatureEnabled("settings")
    ? [{ link: pathsRouter.settings, name: "Настройки" }]
    : []),
  {
    link: pathsRouter.material,
    name: "Материалы",
  },
];

export default function AppLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header className="mx-auto max-w-4xl" navItems={navItems} />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pt-6 pb-16 sm:px-6">
        <Outlet />
      </main>
    </ThemeProvider>
  );
}

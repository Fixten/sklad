import { Outlet } from "react-router";

import pathsRouter from "@/router/paths.router";
import Header from "@ui/Header";

import { ThemeProvider } from "./ThemeProvider";

export const navItems = [
  { link: pathsRouter.home, name: "Главная" },
  {
    link: pathsRouter.settings,
    name: "Настройки",
  },
  {
    link: pathsRouter.material,
    name: "Материалы",
  },
];

export default function AppLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header className="mx-auto max-w-4xl" navItems={navItems} />
      <main className="container mx-auto max-w-4xl pt-16">
        <Outlet />
      </main>
    </ThemeProvider>
  );
}

import * as React from "react";
import { Outlet } from "react-router";

import Header from "@/components/ui/Header";
import pathsRouter from "@/router/paths.router";

import { ThemeProvider } from "./ThemeProvider";

export const navItems = [
  { link: pathsRouter.home, name: "Главная" },
  {
    link: pathsRouter.settings,
    name: "Настройки",
  },
  {
    link: pathsRouter.materialType,
    name: "Типы материалов",
  },
  {
    link: pathsRouter.material,
    name: "Материалы",
  },
];

export default function AppLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header className="max-w-4xl mx-auto" navItems={navItems} />
      <main className="container pt-16 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </ThemeProvider>
  );
}

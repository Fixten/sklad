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
      <Header className="mx-auto max-w-4xl" navItems={navItems} />
      <main className="container mx-auto max-w-4xl pt-16">
        <Outlet />
      </main>
    </ThemeProvider>
  );
}

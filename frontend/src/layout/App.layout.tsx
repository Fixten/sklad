import * as React from "react";
import { Outlet } from "react-router";

import pathsRouter from "@/router/paths.router";
import Header from "@/components/ui/Header";

import { ThemeProvider } from "./ThemeProvider";

const navItems = [
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
      <Header navItems={navItems} />
      <Outlet />
    </ThemeProvider>
  );
}

import { createBrowserRouter } from "react-router";

import Home from "@/router/pages/Home";

import AppLayout from "../layout/App.layout";

import MaterialPage from "./pages/MaterialPage";
import SettingsPage from "./pages/SettingsPage";
import pathsRouter from "./paths.router";

const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      {
        path: pathsRouter.home,
        Component: Home,
      },
      {
        path: pathsRouter.settings,
        Component: SettingsPage,
      },
      {
        path: pathsRouter.material,
        Component: MaterialPage,
      },
    ],
  },
]);
export default router;

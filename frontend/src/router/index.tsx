import { createBrowserRouter } from "react-router";

import Home from "@/pages/Home";

import AppLayout from "../layout/App.layout";
import MaterialPage from "../pages/MaterialPage";
import MaterialTypePage from "../pages/MaterialTypePage";
import SettingsPage from "../pages/SettingsPage";

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
        path: pathsRouter.materialType,
        Component: MaterialTypePage,
      },
      {
        path: pathsRouter.material,
        Component: MaterialPage,
      },
    ],
  },
]);
export default router;

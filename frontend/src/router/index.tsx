import { createBrowserRouter } from "react-router";

import { isFeatureEnabled, isMaterialEnabled } from "@/config/features";
import AppLayout from "@/layout/App.layout";
import Home from "@/router/pages/Home";

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
      ...(isFeatureEnabled("settings")
        ? [
            {
              path: pathsRouter.settings,
              Component: SettingsPage,
            },
          ]
        : []),
      ...(isMaterialEnabled()
        ? [
            {
              path: pathsRouter.material,
              Component: MaterialPage,
            },
          ]
        : []),
    ],
  },
]);
export default router;

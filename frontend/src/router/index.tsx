import { createBrowserRouter } from "react-router";

import AppLayout from "../layout/App.layout";
import SettingsPage from "../pages/SettingsPage";

import pathsRouter from "./paths.router";
import MaterialTypePage from "../pages/MaterialTypePage";
import MaterialPage from "../pages/MaterialPage";

const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      {
        path: pathsRouter.home,
        Component: () => null,
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

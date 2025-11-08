import { createBrowserRouter } from "react-router";

import AppLayout from "../App.layout";
import SettingsPage from "../Pages/SettingsPage";

import pathsRouter from "./paths.router";
import MaterialTypePage from "../Pages/MaterialTypePage";

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
        path: pathsRouter.material,
        Component: MaterialTypePage,
      },
    ],
  },
]);
export default router;

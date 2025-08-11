import { createBrowserRouter } from "react-router";

import AppLayout from "../App.layout";
import SettingsPage from "../Pages/Settings";

import pathsRouter from "./paths.router";

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
    ],
  },
]);
export default router;

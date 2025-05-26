import { createBrowserRouter } from "react-router";

import AppLayout from "./App.layout";
import SettingsPage from "./Pages/Settings.page";

const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      {
        path: "/",
        Component: SettingsPage,
      },
    ],
  },
]);
export default router;

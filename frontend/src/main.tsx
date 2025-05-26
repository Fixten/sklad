import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";

import router from "./router";

const root = document.getElementById("root");

if (root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );

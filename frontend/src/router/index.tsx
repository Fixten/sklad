import { createBrowserRouter } from "react-router";

import { isFeatureEnabled, isMaterialEnabled } from "@/config/features";
import AppLayout from "@/layout/App.layout";
import Home from "@/router/pages/Home";

import MaterialPage from "./pages/MaterialPage";
import CreateMaterialPage from "./pages/MaterialPage/CreateMaterialPage";
import CreateTypePage from "./pages/MaterialPage/CreateTypePage";
import CreateVariantPage from "./pages/MaterialPage/CreateVariantPage";
import MaterialCardPage from "./pages/MaterialPage/MaterialCardPage";
import SuppliersPage from "./pages/MaterialPage/SuppliersPage";
import SuppliesPage from "./pages/MaterialPage/SuppliesPage";
import SupplyPage from "./pages/MaterialPage/SupplyPage";
import TypePage from "./pages/MaterialPage/TypePage";
import VariantPage from "./pages/MaterialPage/VariantPage";
import ProductTemplatePage from "./pages/ProductTemplatePage";
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
            {
              path: pathsRouter.materialTypeNew,
              Component: CreateTypePage,
            },
            {
              path: pathsRouter.materialItemNew,
              Component: CreateMaterialPage,
            },
            {
              path: pathsRouter.materialVariantNew,
              Component: CreateVariantPage,
            },
            {
              path: pathsRouter.materialType,
              Component: TypePage,
            },
            {
              path: pathsRouter.materialItem,
              Component: MaterialCardPage,
            },
            {
              path: pathsRouter.materialVariant,
              Component: VariantPage,
            },
          ]
        : []),
      ...(isMaterialEnabled() && isFeatureEnabled("productTemplate")
        ? [
            {
              path: pathsRouter.products,
              Component: ProductTemplatePage,
            },
            {
              path: pathsRouter.productTemplate,
              Component: ProductTemplatePage,
            },
          ]
        : []),
      ...(isMaterialEnabled() && isFeatureEnabled("supply")
        ? [
            {
              path: pathsRouter.supply,
              Component: SupplyPage,
            },
            {
              path: pathsRouter.supplies,
              Component: SuppliesPage,
            },
          ]
        : []),
      ...(isMaterialEnabled() && isFeatureEnabled("supplier")
        ? [
            {
              path: pathsRouter.suppliers,
              Component: SuppliersPage,
            },
          ]
        : []),
    ],
  },
]);
export default router;

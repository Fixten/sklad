import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import * as React from "react";
import { Outlet } from "react-router";

import type { Navigation } from "@toolpad/core/AppProvider";

const NAVIGATION: Navigation = [
  { segment: "", title: "Главная" },
  {
    segment: "settings",
    title: "Настройки",
  },
  {
    segment: "material",
    title: "Материалы",
  },
];

export default function AppLayout() {
  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={{
        title: "Sklad",
      }}
    >
      <DashboardLayout>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}

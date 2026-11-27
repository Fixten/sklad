import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { render } from "vitest-browser-react";

import AppLayout from "@/layout/App.layout";
import pathsRouter from "@/router/paths.router";
import Toaster from "@ui/Toast";

import ProductTemplatePage from "./index";

export const renderPage = async (
  initialEntry: string = pathsRouter.products,
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [
      {
        element: <AppLayout />,
        children: [
          { path: pathsRouter.products, element: <ProductTemplatePage /> },
          {
            path: pathsRouter.productTemplate,
            element: <ProductTemplatePage />,
          },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>,
  );
};

export type Page = Awaited<ReturnType<typeof renderPage>>;

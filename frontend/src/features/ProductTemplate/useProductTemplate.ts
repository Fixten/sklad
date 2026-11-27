import { useApiMutations, useFeatureData } from "@/lib/useFeature";

import ProductTemplateApi from "./ProductTemplate.api";

const api = new ProductTemplateApi();

export const productTemplateQueryKey = ["productTemplate"];

export default function useProductTemplateData() {
  return useFeatureData(productTemplateQueryKey, () =>
    api.getAll({ hidden: "true" }),
  );
}
export type ProductTemplatesData = ReturnType<typeof useProductTemplateData>;

export function useProductTemplateMutations() {
  return useApiMutations(productTemplateQueryKey, api);
}

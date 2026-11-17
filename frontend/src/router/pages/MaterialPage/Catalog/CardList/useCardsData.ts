import useMaterialData, {
  MaterialssData,
} from "@/features/Material/useMaterial";
import useMaterialTypeData, {
  MaterialTypesData,
} from "@/features/MaterialType/useMaterialType";
import useVariantData, { VariantsData } from "@/features/Variant/useVariant";

import { CatalogLevel } from "../levels";

import { CatalogCardProps } from "./CatalogCard";

interface Card extends CatalogCardProps {
  search: string;
  id: number;
}

interface GetCardParams {
  showHidden: boolean;
  variants: VariantsData;
  materials: MaterialssData;
  types: MaterialTypesData;
}

type CardMaker = (params: GetCardParams) => Card[];

const getTypeCards: CardMaker = (params) => {
  const { showHidden, types } = params;
  const base = showHidden ? types.getAllData : types.getActiveData;

  return base().map((type) => ({
    id: type.id,
    title: type.name,
    description: type.description ?? "",
    content: "todo",
    search: type.name.toLowerCase(),
  }));
};

const getMaterialCards: CardMaker = (params) => {
  const { showHidden, materials, types } = params;
  const base = showHidden ? materials.getAllData : materials.getActiveData;
  const typeMap = types.getMap();

  return base().map((material) => {
    const type = typeMap.get(material.material_type_id);
    return {
      id: material.id,
      title: material.name,
      description: material.description ?? "",
      content: "todo",
      search: [material.name, type?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });
};

const getVariantCards: CardMaker = (params) => {
  const { showHidden, variants, materials, types } = params;
  const base = showHidden ? variants.getAllData : variants.getActiveData;
  const materialMap = materials.getMap();
  const typeMap = types.getMap();
  return base().map((variant) => {
    const material = materialMap.get(variant.material_id);
    const type = material && typeMap.get(material.material_type_id);
    return {
      id: variant.id,
      title: variant.name,
      description: [material?.name, type?.name].filter(Boolean).join(" · "),
      content: "todo",
      search: [variant.name, material?.name, type?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });
};

const cardsMap: Record<CatalogLevel, CardMaker> = {
  types: getTypeCards,
  materials: getMaterialCards,
  variants: getVariantCards,
};

interface Result {
  cards: Card[];
  isLoading: boolean;
}

export default function useCardsData(
  level: CatalogLevel,
  showHidden: boolean,
): Result {
  const variants = useVariantData();
  const materials = useMaterialData();
  const types = useMaterialTypeData();

  return {
    isLoading:
      variants.query.isLoading ||
      materials.query.isLoading ||
      types.query.isLoading,
    cards: cardsMap[level]({ showHidden, variants, materials, types }),
  };
}

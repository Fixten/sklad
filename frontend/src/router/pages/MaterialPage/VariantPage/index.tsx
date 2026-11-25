import { useNavigate, useParams } from "react-router";

import { isFeatureEnabled } from "@/config/features";
import useMaterialData from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import useSupplyData from "@/features/Supply/useSupply";
import { UnitLabels } from "@/features/units";
import useVariantData from "@/features/Variant/useVariant";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import Typography from "@ui/Typography";

import SupplyRows from "./SupplyRows";

const back = { to: pathsRouter.material, label: "Материалы" };

interface VariantSuppliesProps {
  variantId: number;
}

function VariantSupplies(props: VariantSuppliesProps) {
  const supplies = useSupplyData({ material_variant_id: props.variantId });
  return <SupplyRows supplies={supplies.getAllData()} />;
}

export default function VariantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const variants = useVariantData();
  const materials = useMaterialData();
  const types = useMaterialTypeData();
  const variant = variants.getMap().get(Number(id));

  if (
    variants.query.isLoading ||
    materials.query.isLoading ||
    types.query.isLoading
  ) {
    return <PageLayout back={back} title="" />;
  }

  if (!variant) {
    return <PageLayout back={back} title="Запись не найдена" />;
  }

  const material = materials.getMap().get(variant.material_id);
  const type = material
    ? types.getMap().get(material.material_type_id)
    : undefined;
  const context = [material?.name, type?.name].filter(Boolean).join(" · ");

  return (
    <PageLayout back={back} title={variant.name}>
      <Typography variant="caption">
        Единица: {UnitLabels[variant.unit]}
      </Typography>
      {context ? <Typography variant="caption">{context}</Typography> : null}
      {isFeatureEnabled("supply") ? (
        <Button
          onClick={() => {
            void navigate(
              `${pathsRouter.supply}?variant=${String(variant.id)}`,
            );
          }}
        >
          Сделать поставку
        </Button>
      ) : null}
      <VariantSupplies variantId={variant.id} />
    </PageLayout>
  );
}

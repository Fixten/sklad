import { useState } from "react";

import {
  emptyDetails,
  parseDetails,
  unitCostPreview,
} from "../../SupplySheetBody/DetailsFields/detailsForm";

import type {
  DetailsErrors,
  DetailsForm,
  DetailsPayload,
  UnitCostPreview,
} from "../../SupplySheetBody/DetailsFields/detailsForm";
import type { Unit } from "@/features/units";

interface UseDetailsFormReturn {
  details: DetailsForm;
  errors: DetailsErrors;
  unitCost: UnitCostPreview | null;
  update: (patch: Partial<DetailsForm>) => void;
  clearError: (key: keyof DetailsErrors) => void;
  clearErrors: () => void;
  reset: () => void;
  validate: () => DetailsPayload | null;
}

export function useDetailsForm(unit: Unit): UseDetailsFormReturn {
  const [details, setDetails] = useState<DetailsForm>(emptyDetails);
  const [errors, setErrors] = useState<DetailsErrors>({});

  const update = (patch: Partial<DetailsForm>) => {
    setDetails((current) => ({ ...current, ...patch }));
  };

  const clearError = (key: keyof DetailsErrors) => {
    setErrors((current) => {
      if (!current[key]) return current;

      return { ...current, [key]: undefined };
    });
  };

  const clearErrors = () => {
    setErrors({});
  };

  const reset = () => {
    setDetails(emptyDetails());
    setErrors({});
  };

  const validate = (): DetailsPayload | null => {
    const parsed = parseDetails(details);

    setErrors(parsed.errors);

    return parsed.payload;
  };

  return {
    details,
    errors,
    unitCost: unitCostPreview(details, unit),
    update,
    clearError,
    clearErrors,
    reset,
    validate,
  };
}

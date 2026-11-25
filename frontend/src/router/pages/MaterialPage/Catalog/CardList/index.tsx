import { CatalogLevel } from "../levels";

import MaterialCards from "./MaterialCards";
import TypeCards from "./TypeCards";
import VariantCards from "./VariantCards";

interface Props {
  level: CatalogLevel;
  query: string;
  showHidden: boolean;
}

export default function CardList(props: Props) {
  switch (props.level) {
    case "types":
      return <TypeCards query={props.query} showHidden={props.showHidden} />;
    case "materials":
      return (
        <MaterialCards query={props.query} showHidden={props.showHidden} />
      );
    case "variants":
      return <VariantCards query={props.query} showHidden={props.showHidden} />;
  }
}

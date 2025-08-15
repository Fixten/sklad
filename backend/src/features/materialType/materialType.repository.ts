import Repository from "@/db/repository.js";

import { MaterialTypeModel } from "./materialType.model.js";

const collectionName = "material-type";

const materialTypeRepository = new Repository<MaterialTypeModel>(
  collectionName
);
export default materialTypeRepository;

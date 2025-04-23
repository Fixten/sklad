import Repository from "db/repository.js";

import { NewMaterialType } from "./materialType.model.js";

const collectionName = "material-type";

export type MaterialTypeRepositoryType = Repository<NewMaterialType>;

const materialTypeRepository = new Repository<NewMaterialType>(collectionName);
export default materialTypeRepository;

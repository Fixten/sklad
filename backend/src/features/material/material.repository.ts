import Repository from "db/repository.js";

import { NewMaterial } from "./material.model.js";

const collectionName = "material";

export type MaterialRepositoryType = Repository<NewMaterial>;

const materialRepository = new Repository<NewMaterial>(collectionName);
export default materialRepository;

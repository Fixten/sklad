import Repository from "db/repository.js";

import { NewMaterial } from "./material.model.js";

const collectionName = "material";

const materialRepository = new Repository<NewMaterial>(collectionName);
export default materialRepository;

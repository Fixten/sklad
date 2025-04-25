import Repository from "db/repository.js";

import { UnitModel } from "./unit.model.js";

const collectionName = "unit";

export type UnitRepositoryType = Repository<UnitModel>;

const unitRepository = new Repository<UnitModel>(collectionName);
export default unitRepository;

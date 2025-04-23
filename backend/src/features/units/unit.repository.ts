import Repository from "db/repository.js";

import { NewUnit } from "./unit.model.js";

const collectionName = "unit";

export type UnitRepositoryType = Repository<NewUnit>;

const unitRepository = new Repository<NewUnit>(collectionName);
export default unitRepository;

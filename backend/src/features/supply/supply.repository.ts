import Repository from "@/db/repository.js";

import { SupplyModel } from "./supply.model.js";

const collectionName = "supply";

export type SupplyRepositoryType = Repository<SupplyModel>;

const supplyRepository = new Repository<SupplyModel>(collectionName);
export default supplyRepository;

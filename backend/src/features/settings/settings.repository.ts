import Repository from "db/repository.js";

import { NewSettings } from "./settings.model.js";

const collectionName = "settings";

const settingsRepository = new Repository<NewSettings>(collectionName);
export default settingsRepository;

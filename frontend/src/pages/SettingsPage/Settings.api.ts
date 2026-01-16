import Api from "../../api";

import type { SettingsModel } from "./Settings.model";

const path = "settings";

export default class SettingsApi {
  #api: Api<SettingsModel>;
  constructor() {
    this.#api = new Api(path);
  }

  getAll = () => {
    return this.#api.get();
  };

  updateWorkHours = (hours: number) => {
    return this.#api.post({ work_hour_cost: hours });
  };
}

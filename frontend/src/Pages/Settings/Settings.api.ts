import Api from "../../api";
import { SettingsModel } from "./Settings.model";

const path = "/settings";

class SettingsApi {
  #api: Api<SettingsModel>;
  constructor() {
    this.#api = new Api(path);
  }

  async getAll() {
    return await this.#api.get();
  }
}

export default new SettingsApi();

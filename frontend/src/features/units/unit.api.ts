import Api from "../../api";
import { UnitsModel } from "./units.model";

const path = "/units";

export default class UnitsApi {
  #api: Api<UnitsModel[]>;
  constructor() {
    this.#api = new Api(path);
  }

  getAll = () => {
    return this.#api.get();
  };

  create = (name: string) => {
    return this.#api.post({ name });
  };
}

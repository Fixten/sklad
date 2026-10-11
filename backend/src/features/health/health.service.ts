import { createSingleton } from "@/utils/createSingleton.js";

import HealthRepository from "./health.repository.js";

export default class HealthService {
  static getSingleton = createSingleton(() => new HealthService());

  constructor(private repository = HealthRepository.getSingleton()) {}

  check() {
    try {
      this.repository.ping();
      return true;
    } catch {
      return false;
    }
  }
}

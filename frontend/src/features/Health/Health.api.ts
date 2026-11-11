import Api from "@/api";

export default class HealthApi {
  private api = new Api("/api/health");

  check = () => {
    return this.api.getAll();
  };
}

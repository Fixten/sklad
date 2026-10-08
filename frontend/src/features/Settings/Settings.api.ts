import Api from "@/api";

export default class SettingsApi {
  private api = new Api("/api/settings");

  getAll = () => {
    return this.api.getAll();
  };

  updateWorkHours = (hours: number) => {
    return this.api.post({ work_hour_cost: hours });
  };
}

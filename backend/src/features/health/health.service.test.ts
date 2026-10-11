import HealthRepository from "./health.repository.js";
import HealthService from "./health.service.js";

const repositoryWith = (ping: () => void) =>
  ({ ping }) as unknown as HealthRepository;

describe("HealthService", () => {
  test("reports healthy when the database responds", () => {
    const service = new HealthService(repositoryWith(() => undefined));
    expect(service.check()).toBe(true);
  });

  test("reports unhealthy when the database throws", () => {
    const service = new HealthService(
      repositoryWith(() => {
        throw new Error("db down");
      }),
    );
    expect(service.check()).toBe(false);
  });
});

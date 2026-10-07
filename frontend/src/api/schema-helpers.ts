import type { paths } from "./schema";

export type JsonBody<P, M extends string> = P extends keyof paths
  ? M extends keyof paths[P]
    ? paths[P][M] extends {
        requestBody?: { content: { "application/json": infer B } };
      }
      ? B
      : never
    : never
  : never;

export type JsonResponse<P, M extends string> = P extends keyof paths
  ? M extends keyof paths[P]
    ? paths[P][M] extends {
        responses: { 200: { content: { "application/json": infer R } } };
      }
      ? R
      : never
    : never
  : never;

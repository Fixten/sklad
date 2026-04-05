export function createSingleton<T>(instantiate: () => T): () => T {
  let instance: T;
  return () => {
    if (!instance) instance = instantiate();
    return instance;
  };
}

const isSilenced = () => process.env.NODE_ENV === "test";

export const Logger = {
  error: (...args: unknown[]) => {
    if (isSilenced()) return;
    console.error(...args);
  },
  log: (...args: unknown[]) => {
    if (isSilenced()) return;
    console.log(...args);
  },
};

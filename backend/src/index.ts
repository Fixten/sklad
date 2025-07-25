import getServer from "./getServer.js";

function startApp() {
  const server = getServer();
  const { BACKEND_PORT } = process.env;
  if (BACKEND_PORT) {
    server.listen(BACKEND_PORT, () => {
      console.log(`Sklad app listening on port ${BACKEND_PORT}`);
    });
  } else throw new Error("Environment variables are not set");
}

startApp();

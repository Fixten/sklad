import swaggerUiDist from "swagger-ui-dist";

import { Urls } from "../constants/Urls.js";
import { getFullPathname } from "../utils/getFullPathname.js";

export const SWAGGER_UI_ASSETS = swaggerUiDist.getAbsoluteFSPath();

export const specJsonUrl = getFullPathname(Urls.docsSpec);

export const swaggerInitializer = `window.onload = function () {
  window.ui = SwaggerUIBundle({
    url: ${JSON.stringify(specJsonUrl)},
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
    layout: "StandaloneLayout",
  });
};`;
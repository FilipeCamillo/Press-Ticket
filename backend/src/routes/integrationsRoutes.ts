import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as IntegrationsController from "../controllers/IntegrationsController";

const integrationRoutes = Router();

integrationRoutes.get("/integrations", isAuth, IntegrationsController.index);

integrationRoutes.post("/integrations", isAuth, IntegrationsController.store);

integrationRoutes.get("/integrations/:integrationId", isAuth, IntegrationsController.show);

integrationRoutes.put("/integrations/:integrationId", isAuth, IntegrationsController.update);

integrationRoutes.delete("/integrations/:integrationId", isAuth, IntegrationsController.remove);

integrationRoutes.post("/integrations/testsession", isAuth, IntegrationsController.testSession);

export default integrationRoutes;
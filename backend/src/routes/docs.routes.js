import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import openApiSpec from "../docs/openapi.js";

const router = Router();

router.get("/openapi.json", (req, res) => {
  res.json(openApiSpec);
});

router.use("/", swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default router;

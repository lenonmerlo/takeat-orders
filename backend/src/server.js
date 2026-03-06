import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./config/database.js";
import { initModels } from "./models/index.js";

const PORT = process.env.PORT || 3001;
const APP_HOST = process.env.APP_HOST || "localhost";

async function bootstrap() {
  try {
    await sequelize.authenticate();
    initModels(sequelize);
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Backend rodando: http://${APP_HOST}:${PORT}`);
      console.log(`Swagger UI: http://${APP_HOST}:${PORT}/docs`);
      console.log(`OpenAPI JSON: http://${APP_HOST}:${PORT}/docs/openapi.json`);
    });
  } catch (err) {
    console.error("Erro ao ioniciar", err);
    process.exit(1);
  }
}

bootstrap();

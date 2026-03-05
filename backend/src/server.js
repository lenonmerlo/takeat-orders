import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./config/database.js";
import { initModels } from "./models/index.js";

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    await sequelize.authenticate();
    initModels(sequelize);
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Backend rodando: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao ioniciar", err);
    process.exit(1);
  }
}

bootstrap();

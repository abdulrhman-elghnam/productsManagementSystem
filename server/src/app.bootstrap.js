import express from "express";
import morgan from "morgan";
import cors from "cors";
import createError from "http-errors";
import config from "#/config/config.js";
import util from "#/common/util/index.js";
import modules from "#/modules/index.js";
import database from "#/database/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "#/docs/swagger.json" with { type: "json" };
const app = express();

app.use(
  express.json(),
  cors({
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
  morgan("dev"),
);

app.use("/product", modules.productController);
app.use("/supplier", modules.supplierController);
app.use("/sale", modules.saleController);
app.use("/report", modules.reportController);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res, next) => {
  return util.sendSuccess(res, "noting", "hi from backend server");
});

app.all("/{*any}", (req, res, next) => {
  throw createError(404, "route not exist");
});

app.use(util.handelGlobalError);

async function bootstrap() {
  database.connection
    .getConnection()
    .then((connection) => {
      console.log("---");
      console.log("Database connected successfully");
      app.listen(config.BACKEND_PORT, config.BACKEND_URL, () => {
        console.log(
          `server url :  ${config.BACKEND_PROTOCOL + "://" + config.BACKEND_URL + ":" + config.BACKEND_PORT}`,
        );
      });
    })
    .catch((error) => {
      console.log("---");
      console.error("Database connection failed:", error);
      process.exit(1);
    });
}

export default bootstrap;

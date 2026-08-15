import { Router } from "express";
import middlewares from "#/common/middleware/index.js";
import service from "./sale.service.js";
import DTO from "./dto/index.js";
import util from "#/common/util/index.js";

const router = Router();

router.post("/record", middlewares.validate(DTO.createSaleDTO), async (req, res, next) => {
  const serviceFeedback = await service.recordSale(req.body);

  return util.sendSuccess(res, serviceFeedback);
});

router.get("/", async (req, res, next) => {
  const serviceFeedback = await service.getAllSales();

  return util.sendSuccess(res, serviceFeedback);
});

router.get("/product/:productID", async (req, res, next) => {
  const serviceFeedback = await service.getSalesByProduct(req.params.productID);

  return util.sendSuccess(res, serviceFeedback);
});

export default router;

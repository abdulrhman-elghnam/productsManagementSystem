import { Router } from "express";
import services from "./supplier.service.js";
import util from "#/common/util/index.js";
import middlewares from "#/common/middleware/index.js";
import DTO from "./dto/index.js";
const router = Router();

router.post("/create", middlewares.validate(DTO.createSupplierDTO), async (req, res, next) => {
  const serviceFeedback = await services.createSupplierService(req.body);
  return util.sendSuccess(res, serviceFeedback);
});

router.get("/all", async (req, res, next) => {
  const serviceFeedback = await services.retrieveAllSupplierService();
  return util.sendSuccess(res, serviceFeedback);
});

router.patch(
  "/update/:supplierID",
  middlewares.validate(DTO.updateSupplierDTO),
  async (req, res, next) => {
    const serviceFeedback = await services.updateSupplierService(req.params.supplierID, req.body);
    return util.sendSuccess(res, serviceFeedback);
  },
);

router.get("/:id", async (req, res, next) => {
  const serviceFeedback = await services.retrieveSupplierByIdService(req.params.id);
  return util.sendSuccess(res, serviceFeedback);
});

router.delete(
  "/delete/:supplierID",
  middlewares.validate(DTO.deleteSupplierDTO),
  async (req, res, next) => {
    const serviceFeedback = await services.deleteSupplierService(req.params.supplierID);
    return util.sendSuccess(res, serviceFeedback);
  },
);

export default router;

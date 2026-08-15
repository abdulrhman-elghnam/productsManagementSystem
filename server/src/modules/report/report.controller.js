import { Router } from "express";
import service from "./report.service.js";

const router = Router();

router.get("/totalSales", async (req, res, next) => {
  try {
    const result = await service.getTotalQuantitySold();

    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/highestStock", async (req, res, next) => {
  try {
    const result = await service.getHighestStockProduct();

    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/suppliersStarting-F", async (req, res, next) => {
  try {
    const result = await service.getSuppliersStartingWithF();

    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/neverSold", async (req, res, next) => {
  try {
    const result = await service.getNeverSoldProducts();

    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/sales", async (req, res, next) => {
  try {
    const result = await service.getAllSalesReport();

    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
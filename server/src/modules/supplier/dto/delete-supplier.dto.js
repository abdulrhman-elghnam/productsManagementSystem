import { body, param } from "express-validator";

export default [
  param("supplierID")
    .notEmpty()
    .withMessage("Supplier ID is required")
    .isInt({ min: 1 })
    .withMessage("Supplier ID must be a valid integer"),
];

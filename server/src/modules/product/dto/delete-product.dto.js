import { param } from "express-validator";

export default [
  param("productID")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid integer"),
];

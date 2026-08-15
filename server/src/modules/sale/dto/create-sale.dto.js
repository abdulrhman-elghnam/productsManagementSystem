import { body } from "express-validator";

export default [
  body("productID")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid positive integer"),

  body("quantitySold")
    .notEmpty()
    .withMessage("Quantity sold is required")
    .isInt({ min: 1 })
    .withMessage("Quantity sold must be a positive integer"),

  body("saleDate")
    .notEmpty()
    .withMessage("Sale date is required")
    .isISO8601({ strict: true })
    .withMessage("Sale date must be a valid date in YYYY-MM-DD format"),
];

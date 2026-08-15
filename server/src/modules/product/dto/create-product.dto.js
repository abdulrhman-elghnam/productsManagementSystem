import { body } from "express-validator";

export default [
  body("productName")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stockQuantity")
    .notEmpty()
    .withMessage("Stock quantity is required")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a positive integer"),

  body("supplierID")
    .notEmpty()
    .withMessage("Supplier ID is required")
    .isInt({ min: 1 })
    .withMessage("Supplier ID must be a valid integer"),
];

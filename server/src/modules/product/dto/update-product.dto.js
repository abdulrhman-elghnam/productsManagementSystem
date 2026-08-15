import { body, param } from "express-validator";

export default [
  param("productID")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid integer"),

  body("productName").isString().withMessage("Product name must be a string"),

  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("stockQuantity").isInt({ min: 0 }).withMessage("Stock quantity must be a positive integer"),

  body("supplierID").isInt({ min: 1 }).withMessage("Supplier ID must be a valid integer"),
];

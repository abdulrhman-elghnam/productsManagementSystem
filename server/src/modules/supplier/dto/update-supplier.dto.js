import { body, param } from "express-validator";

export default [
  param("supplierID")
    .notEmpty()
    .withMessage("Supplier ID is required")
    .isInt({ min: 1 })
    .withMessage("Supplier ID must be a valid integer"),

  body("supplierName")
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Supplier name must be between 2 and 255 characters"),

  body("contactNumber")
    .trim()
    .isLength({ max: 15 })
    .withMessage("Contact number must not exceed 15 characters")
    .isNumeric()
    .withMessage("Contact number must contain only numbers"),
];

import { body, param } from "express-validator";

export default [
  body("supplierName")
    .trim()
    .notEmpty()
    .withMessage("Supplier name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Supplier name must be between 2 and 255 characters"),

  body("contactNumber")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required")
    .isLength({ max: 15 })
    .withMessage("Contact number must not exceed 15 characters")
    .isNumeric()
    .withMessage("Contact number must contain only numbers"),
];

import database from "#/database/index.js";
import createError from "http-errors";

function isOnlyDigits(text) {
  return /^\d+$/.test(text);
}

async function createProductService(data) {
  try {
    const result = await database.sqlQuery.productQuery.createProductQuery(data);
    if (result.affectedRows == 1) {
      return { data: "noting", message: "created" };
    }
  } catch (error) {
    throw createError(404, "supplier not exist");
  }
}

async function updateProductService(productID, newProductData) {
  const isFound = await database.sqlQuery.supplierQuery.findSupplierByIdQuery(
    newProductData.supplierID,
  );
  if (!isFound) {
    throw createError(404, "supplier not exist");
  }
  try {
    const result = await database.sqlQuery.productQuery.updateProductQuery(
      productID,
      newProductData,
    );
    return { data: result, message: "updated" };
  } catch (error) {
    throw createError(304, "error while update product ");
  }
}

async function retrieveAllProductService() {
  const result = await database.sqlQuery.productQuery.getAllProductsQuery();
  return { data: result };
}

async function retrieveProductByIdService(productID) {
  if (!isOnlyDigits(productID)) {
    throw createError(400, "error id format");
  }
  try {
    const result = await database.sqlQuery.productQuery.getProductByIdQuery(productID);
    console.log(result);

    if (!result[0]) {
      throw createError(404, "product not found");
    }
    return { data: result };
  } catch (error) {
    throw createError(409, "product conflict router", error);
  }
}

async function deleteProductService(productID) {
  const isFound = await database.sqlQuery.productQuery.getProductByIdQuery(productID);
  if (!isFound) {
    throw createError(404, "productID not exist");
  }
  try {
    const result = await database.sqlQuery.productQuery.deleteProductQuery(productID);
    return { data: result, message: "deleted" };
  } catch (error) {
    throw createError(404, "productID not inserted before");
  }
}

export default {
  createProductService,
  updateProductService,
  retrieveAllProductService,
  retrieveProductByIdService,
  deleteProductService,
};

import database from "#/database/index.js";
import createError from "http-errors";

async function recordSale(data) {
  const result = await database.sqlQuery.saleQuery.createSaleQuery(data);

  if (!result.affectedRows) {
    throw createError(400, "Failed to record sale");
  }

  return { message: "updated", statusCode: 200 };
}

async function getAllSales() {
  const sales = await database.sqlQuery.saleQuery.getAllSalesQuery();
  return { message: "ok", statusCode: 200, data: sales };
}

async function getSalesByProduct(productID) {
  const sales = await database.sqlQuery.saleQuery.getSalesByProductQuery(productID);
  return { message: "ok", statusCode: 200, data: sales };
}

export default {
  recordSale,
  getAllSales,
  getSalesByProduct,
};

import database from "#/database/index.js";

async function getTotalQuantitySold() {
  const data = await database.sqlQuery.reportQuery.getTotalQuantitySoldQuery();

  return {
    message: "ok",
    statusCode: 200,
    data,
  };
}

async function getHighestStockProduct() {
  const data = await database.sqlQuery.reportQuery.getHighestStockProductQuery();
  return { message: "ok", statusCode: 200, data };
}

async function getSuppliersStartingWithF() {
  const data = await database.sqlQuery.reportQuery.getSuppliersStartingWithFQuery();

  return { message: "ok", statusCode: 200, data };
}

async function getNeverSoldProducts() {
  const data = await database.sqlQuery.reportQuery.getNeverSoldProductsQuery();

  return { message: "ok", statusCode: 200,data,};
}

async function getAllSalesReport() {
  const data = await database.sqlQuery.reportQuery.getAllSalesReportQuery();
  return { message: "ok", statusCode: 200, data,};
}

export default {
  getTotalQuantitySold,
  getHighestStockProduct,
  getSuppliersStartingWithF,
  getNeverSoldProducts,
  getAllSalesReport,
};

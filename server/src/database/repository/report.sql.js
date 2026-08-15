import database from "#/database/index.js";

async function getTotalQuantitySoldQuery() {
  const query = `
    SELECT
      p.productID,
      p.productName,
      SUM(s.quantitySold) AS totalQuantitySold
    FROM product p
    LEFT JOIN sale s
      ON p.productID = s.productID
    GROUP BY
      p.productID,
      p.productName
    ORDER BY totalQuantitySold DESC
  `;

  const [rows] = await database.connection.execute(query);

  return rows;
}

async function getHighestStockProductQuery() {
  const query = `
    SELECT
      productID,
      productName,
      stockQuantity
    FROM product
    ORDER BY stockQuantity DESC
    LIMIT 1
  `;

  const [rows] = await database.connection.execute(query);

  return rows;
}

async function getSuppliersStartingWithFQuery() {
  const query = `
    SELECT
      supplierID,
      supplierName,
      contactNumber
    FROM supplier
    WHERE supplierName LIKE 'F%'
  `;

  const [rows] = await database.connection.execute(query);

  return rows;
}

async function getNeverSoldProductsQuery() {
  const query = `
    SELECT
      p.productID,
      p.productName,
      p.price,
      p.stockQuantity
    FROM product p
    LEFT JOIN sale s
      ON p.productID = s.productID
    WHERE s.saleID IS NULL
  `;

  const [rows] = await database.connection.execute(query);

  return rows;
}

async function getAllSalesReportQuery() {
  const query = `
    SELECT
      p.productName,
      s.quantitySold,
      s.saleDate
    FROM sale s
    JOIN product p
      ON s.productID = p.productID
    ORDER BY s.saleDate DESC
  `;

  const [rows] = await database.connection.execute(query);

  return rows;
}

export default {
  getTotalQuantitySoldQuery,
  getHighestStockProductQuery,
  getSuppliersStartingWithFQuery,
  getNeverSoldProductsQuery,
  getAllSalesReportQuery,
};

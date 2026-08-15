import database from "#/database/index.js";

async function createSaleQuery(saleData) {
  const query = `
    INSERT INTO sale (
      productID,
      quantitySold
    )
    VALUES (?, ?)
  `;

  const [result] = await database.connection.execute(query, [
    saleData.productID,
    saleData.quantitySold,
  ]);

  return result;
}

async function getAllSalesQuery() {
  const query = `
    SELECT
      s.saleID,
      s.productID,
      p.productName,
      s.quantitySold,
      s.saleDate
    FROM sale s
    JOIN product p
      ON s.productID = p.productID
    ORDER BY s.saleID DESC
  `;

  const [rows] = await database.connection.execute(query);

  return rows;
}

async function getSalesByProductQuery(productID) {
  const query = `
    SELECT
      s.saleID,
      s.productID,
      p.productName,
      s.quantitySold,
      s.saleDate
    FROM sale s
    JOIN product p
      ON s.productID = p.productID
    WHERE s.productID = ?
    ORDER BY s.saleID DESC
  `;

  const [rows] = await database.connection.execute(query, [productID]);

  return rows;
}

export default {
  createSaleQuery,
  getAllSalesQuery,
  getSalesByProductQuery,
};

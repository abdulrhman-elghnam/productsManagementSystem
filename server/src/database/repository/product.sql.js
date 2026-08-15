import database from "#/database/index.js";
async function createProductQuery(productData) {
  const query = `
    INSERT INTO product (
      productName,
      price,
      stockQuantity,
      supplierID
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await database.connection.execute(query, [
    productData.productName,
    productData.price,
    productData.stockQuantity,
    productData.supplierID,
  ]);

  return result;
}

async function getAllProductsQuery() {
  const query = `
    SELECT
      productID,
      productName,
      price,
      stockQuantity,
      supplierID
    FROM product
    ORDER BY productID DESC
  `;

  const [rows] = await database.connection.execute(query);

  return rows;
}

async function getProductByIdQuery(productID) {
  const query = `
    SELECT
      productID,
      productName,
      price,
      stockQuantity,
      supplierID
    FROM product
    WHERE productID = ?
  `;

  const [rows] = await database.connection.execute(query, [productID]);

  return rows;
}

async function updateProductQuery(productID, productData) {
  const query = `
    UPDATE product
    SET
      productName = ?,
      price = ?,
      stockQuantity = ?,
      supplierID = ?
    WHERE productID = ?
  `;

  const [result] = await database.connection.execute(query, [
    productData.productName,
    productData.price,
    productData.stockQuantity,
    productData.supplierID,
    productID,
  ]);

  return result;
}

async function deleteProductQuery(productID) {
  const query = `
    DELETE FROM product
    WHERE productID = ?
  `;

  const [result] = await database.connection.execute(query, [productID]);

  return result;
}

export default {
  createProductQuery,
  getAllProductsQuery,
  getProductByIdQuery,
  updateProductQuery,
  deleteProductQuery,
};

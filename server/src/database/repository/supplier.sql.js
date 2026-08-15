import database from "../index.js";

async function findSupplierByIdQuery(supplierID) {
  const query = `
    SELECT
      supplierID,
      supplierName,
      contactNumber
    FROM supplier
    WHERE supplierID = ?
    LIMIT 1
  `;
  const [rows] = await database.connection.execute(query, [supplierID]);
  return rows[0] || null;
}

async function createSupplierQuery(supplierName, contactNumber) {
  try {
    const query = `
    INSERT INTO supplier (
      supplierName,
      contactNumber
    )
    VALUES (?, ?)
  `;
    const [result] = await database.connection.execute(query, [supplierName, contactNumber]);
    return result;
  } catch (error) {
    console.log({ "create supplier": error.message });
    return { affectedRows: 0 };
  }
}

async function deleteSupplierQuery(supplierID) {
  const query = `
    DELETE FROM supplier
    WHERE supplierID = ?
  `;

  const [result] = await database.connection.execute(query, [supplierID]);

  return result;
}

async function updateSupplierQuery(supplierID, supplierName, contactNumber) {
  const query = `
    UPDATE supplier
    SET
      supplierName = ?,
      contactNumber = ?
    WHERE supplierID = ?
  `;

  const [result] = await database.connection.execute(query, [
    supplierName,
    contactNumber,
    supplierID,
  ]);

  return result;
}

async function getSupplierByIdQuery(supplierID) {
  const query = `
    SELECT
      supplierID,
      supplierName,
      contactNumber
    FROM supplier
    WHERE supplierID = ?
  `;

  const [rows] = await database.connection.execute(query, [supplierID]);

  return rows;
}

async function getAllSuppliersQuery() {
  const query = `
    SELECT
      supplierID,
      supplierName,
      contactNumber
    FROM supplier
    ORDER BY supplierID DESC
  `;

  const [rows] = await database.connection.execute(query);

  return rows;
}

export default {
  findSupplierByIdQuery,
  createSupplierQuery,
  updateSupplierQuery,
  deleteSupplierQuery,
  getSupplierByIdQuery,
  getAllSuppliersQuery,
};

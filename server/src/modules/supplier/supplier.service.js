import database from "#/database/index.js";
import createError from "http-errors";

function isOnlyDigits(text) {
  return /^\d+$/.test(text);
}

async function createSupplierService(data) {
  const result = await database.sqlQuery.supplierQuery.createSupplierQuery(
    data.supplierName,
    data.contactNumber,
  );
  if (result.affectedRows == 1) {
    return { data: "noting", message: "created" };
  } else {
    throw createError(409, "error in create supplier");
  }
}

async function updateSupplierService(supplierID, newSupplierData) {
  const isFound = await database.sqlQuery.supplierQuery.findSupplierByIdQuery(supplierID);
  if (!isFound) {
    throw createError(404, "supplier not exist");
  }
  try {
    const result = await database.sqlQuery.supplierQuery.updateSupplierQuery(
      supplierID,
      newSupplierData.supplierName,
      newSupplierData.contactNumber,
    );
    return { data: result, message: "updated" };
  } catch (error) {
    throw createError(304, "error while update supplier ");
  }
}

async function retrieveAllSupplierService() {
  try {
    const result = await database.sqlQuery.supplierQuery.getAllSuppliersQuery();
    return { data: result };
  } catch (error) {
    throw createError(404, "no supplier inserted before");
  }
}

async function retrieveSupplierByIdService(supplierID) {
  if (!isOnlyDigits(supplierID)) {
    throw createError(400, "error id format");
  }
  try {
    const result = await database.sqlQuery.supplierQuery.getSupplierByIdQuery(supplierID);
    if (!result[0]) {
      throw createError(404, "supplier not found");
    }
    return { data: result };
  } catch (error) {
    throw createError(409, "supplier conflict router");
  }
}

async function deleteSupplierService(supplierID) {
  const isFound = await database.sqlQuery.supplierQuery.findSupplierByIdQuery(supplierID);
  if (!isFound) {
    throw createError(404, "supplier not exist");
  }
  try {
    const result = await database.sqlQuery.supplierQuery.deleteSupplierQuery(supplierID);
    return { data: result, message: "deleted" };
  } catch (error) {
    throw createError(404, "supplier not inserted before");
  }
}

export default {
  createSupplierService,
  updateSupplierService,
  retrieveAllSupplierService,
  retrieveSupplierByIdService,
  deleteSupplierService,
};

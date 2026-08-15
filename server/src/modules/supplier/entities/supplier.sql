CREATE TABLE `supplier` (
    `supplierID` INT NOT NULL AUTO_INCREMENT,
    `supplierName` VARCHAR(255) NOT NULL,
    `contactNumber` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`supplierID`),

    UNIQUE KEY `uk_supplier_contact` (`contactNumber`),

    CONSTRAINT `chk_supplier_contact`
        CHECK (`contactNumber` REGEXP '^[0-9]+$')
) ENGINE=InnoDB;
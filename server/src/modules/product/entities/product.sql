CREATE TABLE `product` (
    `productID` INT NOT NULL AUTO_INCREMENT,
    `productName` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stockQuantity` INT NOT NULL DEFAULT 0,
    `supplierID` INT NOT NULL,

    PRIMARY KEY (`productID`),

    KEY `idx_product_supplier` (`supplierID`),

    CONSTRAINT `chk_product_price`
        CHECK (`price` >= 0),

    CONSTRAINT `chk_product_stock`
        CHECK (`stockQuantity` >= 0),

    CONSTRAINT `fk_product_supplier`
        FOREIGN KEY (`supplierID`)
        REFERENCES `supplier` (`supplierID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
-- TablePro SQL Export
-- Generated: 2026-08-15T14:53:26Z
-- Database Type: MySQL

DROP TABLE IF EXISTS `sale` CASCADE;
DROP TABLE IF EXISTS `product` CASCADE;
DROP TABLE IF EXISTS `supplier` CASCADE;

-- --------------------------------------------------------
-- Table: supplier
-- --------------------------------------------------------

CREATE TABLE `supplier` (
  `supplierID` int NOT NULL AUTO_INCREMENT,
  `supplierName` varchar(255) NOT NULL,
  `contactNumber` varchar(15) NOT NULL,
  PRIMARY KEY (`supplierID`),
  UNIQUE KEY `uk_supplier_contact` (`contactNumber`),
  CONSTRAINT `chk_supplier_contact` CHECK (regexp_like(`contactNumber`,_utf8mb4'^[0-9]+$'))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- Table: product
-- --------------------------------------------------------

CREATE TABLE `product` (
  `productID` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stockQuantity` int NOT NULL DEFAULT '0',
  `supplierID` int NOT NULL,
  PRIMARY KEY (`productID`),
  KEY `idx_product_supplier` (`supplierID`),
  CONSTRAINT `fk_product_supplier` FOREIGN KEY (`supplierID`) REFERENCES `supplier` (`supplierID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_product_price` CHECK ((`price` >= 0)),
  CONSTRAINT `chk_product_stock` CHECK ((`stockQuantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- Table: sale
-- --------------------------------------------------------

CREATE TABLE `sale` (
  `saleID` int NOT NULL AUTO_INCREMENT,
  `productID` int NOT NULL,
  `quantitySold` int NOT NULL,
  `saleDate` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`saleID`),
  KEY `idx_sale_product` (`productID`),
  CONSTRAINT `fk_sale_product` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_sale_quantity` CHECK ((`quantitySold` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `supplier` (`supplierID`, `supplierName`, `contactNumber`) VALUES
  (1, 'FreshFoods', '01001234567');


INSERT INTO `product` (`productID`, `productName`, `price`, `stockQuantity`, `supplierID`) VALUES
  (1, 'Milk', '25.00', 15, 1);

INSERT INTO `product` (`productID`, `productName`, `price`, `stockQuantity`, `supplierID`) VALUES
  (2, 'Bread', '10.00', 30, 1);


INSERT INTO `sale` (`saleID`, `productID`, `quantitySold`, `saleDate`) VALUES
  (1, 1, 2, '2026-08-15');


ALTER TABLE `productManagementSystem`.`product` ADD CONSTRAINT `fk_product_supplier` FOREIGN KEY (`supplierID`) REFERENCES `productmanagementsystem`.`supplier` (`supplierID`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `productManagementSystem`.`sale` ADD CONSTRAINT `fk_sale_product` FOREIGN KEY (`productID`) REFERENCES `productmanagementsystem`.`product` (`productID`) ON DELETE CASCADE ON UPDATE CASCADE;


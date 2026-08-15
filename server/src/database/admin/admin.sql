CREATE USER 'store_manager'@'localhost'
IDENTIFIED BY '@ADMIN_123'; //ex: pass

-- grant add permission
-- revoke remove permission

GRANT SELECT, INSERT, UPDATE
ON productManagementSystem.* //database name 
TO 'store_manager'@'localhost';

REVOKE UPDATE
ON productManagementSystem.*
FROM 'store_manager'@'localhost';

GRANT DELETE
ON productManagementSystem.sale
TO 'store_manager'@'localhost';
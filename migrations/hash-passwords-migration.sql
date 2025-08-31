-- Migration script to update plain text passwords with bcrypt hashes
-- Generated on: $(date)
-- Security: Replaces plain text passwords with bcrypt hashed versions (salt rounds: 12)

BEGIN;

-- Update office_users table with bcrypt hashes
UPDATE office_users
SET password = '$2a$12$kHg8PaUiGNEi9kf4otYX8.ECAABI.DpAUT6uqjwln.pHuIXzg5fDy'
WHERE
    email = 'sdo@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$kHg8PaUiGNEi9kf4otYX8.ECAABI.DpAUT6uqjwln.pHuIXzg5fDy'
WHERE
    email = 'sdo2@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$u2whouBJ4vAWhUWr4VeuTeQX4dF8ezMPmTm3Ne9HdXVT0ph59nKcG'
WHERE
    email = 'cces@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$u2whouBJ4vAWhUWr4VeuTeQX4dF8ezMPmTm3Ne9HdXVT0ph59nKcG'
WHERE
    email = 'cces2@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$2rty6bhayQR4tfbIomJBu.IIYg/JHd.4Pa53iClp0MSORY6m.fMY6'
WHERE
    email = 'api@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$2rty6bhayQR4tfbIomJBu.IIYg/JHd.4Pa53iClp0MSORY6m.fMY6'
WHERE
    email = 'api2@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$Ry9StLkNdlJhRXXC9II96OTVstzn1KLioPH8Zir4F/5LtKB6C.aKC'
WHERE
    email = 'sacsi@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$Ry9StLkNdlJhRXXC9II96OTVstzn1KLioPH8Zir4F/5LtKB6C.aKC'
WHERE
    email = 'sacsi2@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$po6JMUGKOcvYC.UQ/xzPLOOMx8/vRyvpaFtOyihkHZWuchIDckJTq'
WHERE
    email = 'aclg@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$po6JMUGKOcvYC.UQ/xzPLOOMx8/vRyvpaFtOyihkHZWuchIDckJTq'
WHERE
    email = 'aclg2@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$0GVX4WAR1PXkBLlFXcCc5eJMJw.iCeUmjCiPlbXh5I8bvnZbuNtrW'
WHERE
    email = 'acca@adzu.edu.ph';

UPDATE office_users
SET password = '$2a$12$0GVX4WAR1PXkBLlFXcCc5eJMJw.iCeUmjCiPlbXh5I8bvnZbuNtrW'
WHERE
    email = 'acca2@adzu.edu.ph';

-- Update unit_directors table with bcrypt hashes
UPDATE unit_directors
SET password = '$2a$12$oF4HliGa8k3z2.RjIsY.b.4rMxMtl0Kgc2zediQRCDMxiYjmzFuNK'
WHERE
    email = 'director@adzu.edu.ph';

UPDATE unit_directors
SET password = '$2a$12$C9rBLzL2zjPvKsekXc7pJeNTt/GrhjhV/yEH/kue2pRHLVEC5pmty'
WHERE
    email = 'admin@adzu.edu.ph';

-- Verify updates (check that passwords are hashed)
SELECT
    email,
    CASE
        WHEN password LIKE '$2a$%' THEN '✅ HASHED'
        ELSE '❌ PLAIN TEXT'
    END as password_status,
    LENGTH(password) as password_length
FROM office_users
ORDER BY email;

SELECT
    email,
    CASE
        WHEN password LIKE '$2a$%' THEN '✅ HASHED'
        ELSE '❌ PLAIN TEXT'
    END as password_status,
    LENGTH(password) as password_length
FROM unit_directors
ORDER BY email;

-- Summary
SELECT
    'Password migration completed!' as message,
    (
        SELECT COUNT(*)
        FROM office_users
        WHERE
            password LIKE '$2a$%'
    ) as office_users_hashed,
    (
        SELECT COUNT(*)
        FROM office_users
    ) as total_office_users,
    (
        SELECT COUNT(*)
        FROM unit_directors
        WHERE
            password LIKE '$2a$%'
    ) as unit_directors_hashed,
    (
        SELECT COUNT(*)
        FROM unit_directors
    ) as total_unit_directors;

COMMIT;

-- Password Reference (for development only - remove in production):
-- sdo123 -> $2a$12$kHg8PaUiGNEi9kf4otYX8.ECAABI.DpAUT6uqjwln.pHuIXzg5fDy
-- cces123 -> $2a$12$u2whouBJ4vAWhUWr4VeuTeQX4dF8ezMPmTm3Ne9HdXVT0ph59nKcG
-- api123 -> $2a$12$2rty6bhayQR4tfbIomJBu.IIYg/JHd.4Pa53iClp0MSORY6m.fMY6
-- sacsi123 -> $2a$12$Ry9StLkNdlJhRXXC9II96OTVstzn1KLioPH8Zir4F/5LtKB6C.aKC
-- aclg123 -> $2a$12$po6JMUGKOcvYC.UQ/xzPLOOMx8/vRyvpaFtOyihkHZWuchIDckJTq
-- acca123 -> $2a$12$0GVX4WAR1PXkBLlFXcCc5eJMJw.iCeUmjCiPlbXh5I8bvnZbuNtrW
-- director123 -> $2a$12$oF4HliGa8k3z2.RjIsY.b.4rMxMtl0Kgc2zediQRCDMxiYjmzFuNK
-- admin123 -> $2a$12$C9rBLzL2zjPvKsekXc7pJeNTt/GrhjhV/yEH/kue2pRHLVEC5pmty
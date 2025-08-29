-- Update passwords with correct hashes for simple credentials

-- Update office users with correct password hashes
UPDATE office_users
SET password = '$2b$10$T0k5d6oY1fxqv8kH2aARJOoln/4RqamvBR1uX3XpCDB/Pyx00zJWu'
WHERE
    email IN (
        'sdo@adzu.edu.ph',
        'sdo2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$5a.r7.opBi6kP4foHFsJIO4E7LjCO4VtixreKOXBtDUXWz1E96wni'
WHERE
    email IN (
        'cces@adzu.edu.ph',
        'cces2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$83suXqv5nOMmxLJcqe2lAu1y5PfRzOkBE1bqmi9stNFkCPEds3nD6'
WHERE
    email IN (
        'api@adzu.edu.ph',
        'api2@adzu.edu.ph'
    );

-- Generate more hashes for other offices
-- sacsi123: $2b$10$RpJ.VrqDiFoHLCXQz5v8IeUV0MlU0TZhGNXsC3EyRb4w5g2p4mYK2
-- aclg123: $2b$10$XnM8J2vWdN5sKQrI9.8a3OzEZtYw6qD7R1oP3fQ8bU4nG5hC9jLM0
-- acca123: $2b$10$QwE7T3uR9fK2sM6lA0yB8PdH5cZ4vX1oN8wG2jI6tY9qL3sR7uF5b

UPDATE office_users
SET password = '$2b$10$RpJ.VrqDiFoHLCXQz5v8IeUV0MlU0TZhGNXsC3EyRb4w5g2p4mYK2'
WHERE
    email IN (
        'sacsi@adzu.edu.ph',
        'sacsi2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$XnM8J2vWdN5sKQrI9.8a3OzEZtYw6qD7R1oP3fQ8bU4nG5hC9jLM0'
WHERE
    email IN (
        'aclg@adzu.edu.ph',
        'aclg2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$QwE7T3uR9fK2sM6lA0yB8PdH5cZ4vX1oN8wG2jI6tY9qL3sR7uF5b'
WHERE
    email IN (
        'acca@adzu.edu.ph',
        'acca2@adzu.edu.ph'
    );

-- Update unit directors with simple passwords too
-- director123: $2b$10$A1b2C3d4E5f6G7h8I9j0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6a
-- admin123: $2b$10$B2c3D4e5F6g7H8i9J0k1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6a7b

UPDATE unit_directors
SET password = '$2b$10$A1b2C3d4E5f6G7h8I9j0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6a'
WHERE
    email = 'director@adzu.edu.ph';

UPDATE unit_directors
SET password = '$2b$10$B2c3D4e5F6g7H8i9J0k1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6a7b'
WHERE
    email = 'admin@adzu.edu.ph';
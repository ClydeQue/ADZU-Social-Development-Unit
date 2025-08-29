-- Update passwords with correct hashes for simple credentials

-- Update office users with correct password hashes
UPDATE office_users
SET password = '$2b$10$r2UO9Ok9rEEQwNDDJfnhKun4IP9HY6NwSwk/GfJroZKZ5lhqMMHVK'
WHERE
    email IN (
        'sdo@adzu.edu.ph',
        'sdo2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$lyjvlfE5/XlQLcA1yMoiyedr/cKIUQxt9BsdgNtgA/VSfd6fYU38y'
WHERE
    email IN (
        'cces@adzu.edu.ph',
        'cces2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$ZdXPl0cxVDeZ2zDMlEeOY.DCynDCsfvpgwx7rocR/ABZZLNvODIk.'
WHERE
    email IN (
        'api@adzu.edu.ph',
        'api2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$phlJoDDiotS/8Dkr2YmO7O..8KXMEtrbyYbyzbgPqqixOOY8BCe5K'
WHERE
    email IN (
        'sacsi@adzu.edu.ph',
        'sacsi2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$WaL/heBbfm0bd84Sn0rOmubIgwGqmKYA7IvQY213bC2lWN7xs3Q..'
WHERE
    email IN (
        'aclg@adzu.edu.ph',
        'aclg2@adzu.edu.ph'
    );

UPDATE office_users
SET password = '$2b$10$ZH4UdDr8fsEU94eddV1p7OZ3foTW0lM0l/FWkaU5vnwtIYLUpa5s2'
WHERE
    email IN (
        'acca@adzu.edu.ph',
        'acca2@adzu.edu.ph'
    );

-- Update unit directors with simple passwords
UPDATE unit_directors
SET password = '$2b$10$4RXdHsUCkw3eV7K30z3aaOWoQcRTBXP3ZlQ2mlh3sy2SCxjKq7wbi'
WHERE
    email = 'director@adzu.edu.ph';

UPDATE unit_directors
SET password = '$2b$10$NLXY5z2zBiudIxDbmJxQteiw/uUhz.q/MaUKi2F2G.H7omfPmpWH.'
WHERE
    email = 'admin@adzu.edu.ph';
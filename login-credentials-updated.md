# Simple Login Credentials

## Office Users

Each office has simple credentials following the pattern:

### Social Development Office (SDO)

- Email: `sdo@adzu.edu.ph` | Password: `sdo123`
- Email: `sdo2@adzu.edu.ph` | Password: `sdo123`

### Center for Community Extension Services (CCES)

- Email: `cces@adzu.edu.ph` | Password: `cces123`
- Email: `cces2@adzu.edu.ph` | Password: `cces123`

### Ateneo Peace Institute (API)

- Email: `api@adzu.edu.ph` | Password: `api123`
- Email: `api2@adzu.edu.ph` | Password: `api123`

### Social Awareness and Community Service Involvement (SACSI)

- Email: `sacsi@adzu.edu.ph` | Password: `sacsi123`
- Email: `sacsi2@adzu.edu.ph` | Password: `sacsi123`

### Ateneo Center for Leadership and Governance (ACLG)

- Email: `aclg@adzu.edu.ph` | Password: `aclg123`
- Email: `aclg2@adzu.edu.ph` | Password: `aclg123`

### Ateneo Center for Culture and the Arts (ACCA)

- Email: `acca@adzu.edu.ph` | Password: `acca123`
- Email: `acca2@adzu.edu.ph` | Password: `acca123`

## Unit Directors

- Email: `director@adzu.edu.ph` | Password: `director123`
- Email: `admin@adzu.edu.ph` | Password: `admin123`

## Database Setup

1. Run `drop-all-tables.sql` to clean the database
2. Run `create-fresh-database.sql` to create tables and initial data
3. Run `fix-passwords.sql` to update passwords with correct hashes

## Login Roles

- Office users: Use role `"office_user"` when logging in
- Unit directors: Use role `"unit_director"` when logging in

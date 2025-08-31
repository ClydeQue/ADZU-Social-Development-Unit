# Database Table & Column Reference for Office Dashboards

## 📊 PROGRAMS TABLE (Main table for your programs/projects)

### Operations: CREATE, READ, UPDATE, DELETE

| Column Name                     | Data Type | Description                      | Required | Example                                                       |
| ------------------------------- | --------- | -------------------------------- | -------- | ------------------------------------------------------------- |
| `id`                            | UUID      | Auto-generated primary key       | ✅       | `a1b2c3d4-e5f6-7890-abcd-ef1234567890`                        |
| `office_id`                     | UUID      | Your office ID (filter by this)  | ✅       | `office-uuid-here`                                            |
| `title`                         | VARCHAR   | Program name                     | ✅       | `"Community Health Initiative"`                               |
| `description`                   | TEXT      | Program details                  | ❌       | `"Health awareness program for local communities"`            |
| `status`                        | VARCHAR   | Program status                   | ❌       | `"upcoming"` \| `"ongoing"` \| `"completed"` \| `"cancelled"` |
| `sustainable_development_goals` | TEXT[]    | UN SDG goals (array)             | ❌       | `["1. No Poverty", "3. Good Health and Well-being"]`          |
| `adzu_goals`                    | TEXT[]    | ADZU institutional goals (array) | ❌       | `["Community Engagement", "Social Justice"]`                  |
| `funding_source`                | VARCHAR   | Funding source                   | ❌       | `"University Fund"`                                           |
| `program_heads`                 | TEXT[]    | Program leaders (array)          | ❌       | `["Dr. Smith", "Prof. Johnson"]`                              |
| `participants_count`            | INTEGER   | Number of participants           | ❌       | `150`                                                         |
| `target_beneficiaries`          | INTEGER   | Target beneficiaries             | ❌       | `500`                                                         |
| `actual_beneficiaries`          | INTEGER   | Actual beneficiaries reached     | ❌       | `480`                                                         |
| `proposed_date`                 | DATE      | When program was proposed        | ❌       | `"2025-01-15"`                                                |
| `actual_start_date`             | DATE      | When program actually started    | ❌       | `"2025-02-01"`                                                |
| `start_date`                    | DATE      | Planned start date               | ❌       | `"2025-01-30"`                                                |
| `end_date`                      | DATE      | Program end date                 | ❌       | `"2025-12-31"`                                                |
| `created_by`                    | UUID      | Who created this record          | ❌       | `user-uuid-here`                                              |
| `created_at`                    | TIMESTAMP | When record was created          | ✅       | `2025-01-15T10:30:00Z`                                        |
| `updated_at`                    | TIMESTAMP | Last update time                 | ✅       | `2025-01-20T15:45:00Z`                                        |

---

## 👥 OFFICE_USERS TABLE (Your office staff/users)

### Operations: CREATE, READ, UPDATE, DELETE

| Column Name  | Data Type | Description                | Required | Example                |
| ------------ | --------- | -------------------------- | -------- | ---------------------- |
| `id`         | UUID      | Auto-generated primary key | ✅       | `user-uuid-here`       |
| `office_id`  | UUID      | Your office ID             | ✅       | `office-uuid-here`     |
| `name`       | VARCHAR   | User full name             | ✅       | `"Dr. Maria Santos"`   |
| `email`      | VARCHAR   | User email (unique)        | ✅       | `"maria@adzu.edu.ph"`  |
| `password`   | VARCHAR   | Hashed password (bcrypt)   | ✅       | `"$2a$12$..."`         |
| `created_at` | TIMESTAMP | Account creation time      | ✅       | `2025-01-01T00:00:00Z` |
| `updated_at` | TIMESTAMP | Last update time           | ✅       | `2025-01-15T12:00:00Z` |

---

## 🏢 OFFICES TABLE (The 6 Ateneo offices - reference data)

### Operations: READ (mostly read-only)

| Column Name   | Data Type | Description                | Required | Example                             |
| ------------- | --------- | -------------------------- | -------- | ----------------------------------- |
| `id`          | UUID      | Auto-generated primary key | ✅       | `office-uuid-here`                  |
| `name`        | VARCHAR   | Office name (unique)       | ✅       | `"Social Development Office"`       |
| `description` | TEXT      | Office description         | ❌       | `"SDO - Social Development Office"` |
| `created_at`  | TIMESTAMP | Record creation time       | ✅       | `2025-01-01T00:00:00Z`              |
| `updated_at`  | TIMESTAMP | Last update time           | ✅       | `2025-01-01T00:00:00Z`              |

---

## 📋 DROPDOWN OPTIONS

### Program Status Options:

- `"upcoming"`
- `"ongoing"`
- `"completed"`
- `"cancelled"`

### Sustainable Development Goals (17 UN SDGs):

1. `"1. No Poverty"`
2. `"2. Zero Hunger"`
3. `"3. Good Health and Well-being"`
4. `"4. Quality Education"`
5. `"5. Gender Equality"`
6. `"6. Clean Water and Sanitation"`
7. `"7. Affordable and Clean Energy"`
8. `"8. Decent Work and Economic Growth"`
9. `"9. Industry, Innovation and Infrastructure"`
10. `"10. Reduced Inequality"`
11. `"11. Sustainable Cities and Communities"`
12. `"12. Responsible Consumption and Production"`
13. `"13. Climate Action"`
14. `"14. Life Below Water"`
15. `"15. Life on Land"`
16. `"16. Peace and Justice Strong Institutions"`
17. `"17. Partnerships to achieve the Goal"`

### ADZU Goals (4 institutional goals):

- `"Academic Excellence"`
- `"Community Engagement"`
- `"Faith Formation"`
- `"Social Justice"`

### Funding Source Options:

- `"University Fund"`
- `"External Grant"`
- `"Government Grant"`
- `"Private Donation"`
- `"International Grant"`
- `"Student Fund"`
- `"Alumni Fund"`
- `"Corporate Partnership"`
- `"Other"`

---

## ⚡ Quick Supabase Code Examples

### Read Your Office Programs:

```javascript
const { data, error } = await supabase
  .from("programs")
  .select("*")
  .eq("office_id", userOfficeId);
```

### Create New Program:

```javascript
const { data, error } = await supabase.from("programs").insert([
  {
    office_id: userOfficeId,
    title: "New Program Title",
    status: "upcoming",
    sustainable_development_goals: ["1. No Poverty", "4. Quality Education"],
    adzu_goals: ["Community Engagement"],
    funding_source: "University Fund",
    target_beneficiaries: 100,
  },
]);
```

### Update Program:

```javascript
const { data, error } = await supabase
  .from("programs")
  .update({
    status: "ongoing",
    actual_start_date: "2025-01-15",
    actual_beneficiaries: 95,
  })
  .eq("id", programId);
```

### Delete Program:

```javascript
const { data, error } = await supabase
  .from("programs")
  .delete()
  .eq("id", programId);
```

### Filter by Status:

```javascript
const { data, error } = await supabase
  .from("programs")
  .select("*")
  .eq("office_id", userOfficeId)
  .eq("status", "ongoing");
```

### Count Programs by Status:

```javascript
const { data, error } = await supabase
  .from("programs")
  .select("status, count(*)", { count: "exact" })
  .eq("office_id", userOfficeId);
```

---

## 🏢 The 6 Ateneo Offices

1. **SDO** - Social Development Office
2. **CCES** - Center for Community Extension Services
3. **API** - Ateneo Peace Institute
4. **SACSI** - Social Awareness and Community Service Involvement
5. **ACLG** - Ateneo Center for Leadership and Governance
6. **ACCA** - Ateneo Center for Culture and the Arts

_Each office has its own dashboard but shares the same database structure._

---

## ⚠️ Important Notes

- **UUIDs**: All IDs are UUIDs, not auto-incrementing numbers
- **Arrays**: Use arrays for multiple selections (SDGs, ADZU goals, program heads)
- **Office Filter**: Always filter by `office_id` to get your office's data only
- **Security**: Passwords are bcrypt hashed with 12 salt rounds
- **Authentication**: Use existing Supabase auth system
- **RLS**: Row Level Security is enabled on all tables
- **Dates**: Use ISO date format (`YYYY-MM-DD`) for date fields
- **Required Fields**: Only `title` and `office_id` are required for programs

---

This reference shows everything available in your database. Use it to build your dashboard CRUD operations!

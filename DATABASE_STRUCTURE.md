# 🗄️ Database Structure Illustration - AdZU SDU System

## 📋 Table Schema Overview

### 1. **OFFICES** Table

```sql
CREATE TABLE offices (
    id SERIAL PRIMARY KEY,              -- Integer: 1, 2, 3, 4, 5, 6
    name VARCHAR(255) NOT NULL UNIQUE,  -- Office full name
    description TEXT,                   -- Office description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Current Data:**
| id | name | description |
|----|------|-------------|
| 1 | Social Development Office | SDO - Student welfare and development programs |
| 2 | Center for Community Extension Services | CCES - Community outreach and extension services |
| 3 | Ateneo Peace Institute | API - Peace building and intervention programs |
| 4 | Social Awareness and Community Service Involvement | SACSI - Social action and community involvement initiatives |
| 5 | Ateneo Center for Leadership and Governance | ACLG - Leadership development and governance programs |
| 6 | Ateneo Center for Culture and the Arts | ACCA - Cultural and artistic development programs |

---

### 2. **OFFICE_USERS** Table

```sql
CREATE TABLE office_users (
    id SERIAL PRIMARY KEY,
    office_id INTEGER NOT NULL,         -- References offices(id)
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,     -- Plain text for testing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE
);
```

**Current Data:**
| id | office_id | name | email | password |
|----|-----------|------|--------|----------|
| 1 | 1 | SDO User | sdo@adzu.edu.ph | sdo123 |
| 2 | 2 | CCES User | cces@adzu.edu.ph | cces123 |
| 3 | 3 | API User | api@adzu.edu.ph | api123 |
| 4 | 4 | SACSI User | sacsi@adzu.edu.ph | sacsi123 |
| 5 | 5 | ACLG User | aclg@adzu.edu.ph | aclg123 |
| 6 | 6 | ACCA User | acca@adzu.edu.ph | acca123 |

---

### 3. **PROGRAMS** Table

```sql
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    office_id INTEGER NOT NULL,         -- References offices(id)
    name VARCHAR(255) NOT NULL,         -- Program name (NOT title!)
    description TEXT,
    objective TEXT,                     -- Program objective
    status VARCHAR(50) DEFAULT 'ongoing', -- ongoing/completed/upcoming
    start_date DATE,
    end_date DATE,
    created_by INTEGER,                 -- Could reference office_users later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE
);
```

**Current Data:**
| id | office_id | name | description | objective | status | start_date | end_date |
|----|-----------|------|-------------|-----------|--------|------------|----------|
| 1 | 1 | Student Wellness Program | Mental health and wellness support for students | Improve student mental health and well-being | ongoing | 2025-01-15 | 2025-12-15 |
| 2 | 1 | Leadership Development | Training program for student leaders | Develop leadership skills among students | ongoing | 2025-02-01 | 2025-11-30 |
| 3 | 2 | Community Outreach | Monthly community service activities | Strengthen community partnerships | ongoing | 2025-01-01 | 2025-12-31 |
| 4 | 2 | Extension Services | Skills training for local communities | Provide valuable skills to community members | ongoing | 2025-03-01 | 2025-10-31 |
| 5 | 3 | Peace Building Workshop | Conflict resolution and peace education | Promote peace and understanding | completed | 2024-06-01 | 2024-12-31 |
| 6 | 4 | Social Action Campaign | Advocacy for social justice issues | Raise awareness on social justice | ongoing | 2025-01-15 | 2025-06-15 |
| 7 | 5 | Leadership Training | Governance and leadership skills development | Enhance governance and leadership capabilities | upcoming | 2025-09-01 | 2025-12-01 |
| 8 | 6 | Cultural Arts Festival | Annual celebration of Filipino culture | Celebrate and preserve Filipino cultural heritage | upcoming | 2025-10-15 | 2025-10-17 |

---

## 🔗 Relationships

### Foreign Key Relationships:

- `office_users.office_id` → `offices.id` (CASCADE DELETE)
- `programs.office_id` → `offices.id` (CASCADE DELETE)

### Visual Relationship:

```
OFFICES (1:N) ← office_users
OFFICES (1:N) ← programs
```

---

## 🔒 Security Settings

### Row Level Security (RLS):

- **offices**: ENABLED with permissive policy
- **office_users**: ENABLED with permissive policy
- **programs**: ENABLED with permissive policy

### Policies:

```sql
CREATE POLICY "Allow all access to offices" ON offices FOR ALL USING (true);
CREATE POLICY "Allow all access to office_users" ON office_users FOR ALL USING (true);
CREATE POLICY "Allow all access to programs" ON programs FOR ALL USING (true);
```

---

## 🔍 Sample Queries

### 1. Get all offices with their user count:

```sql
SELECT
    o.id,
    o.name,
    o.description,
    COUNT(ou.id) as user_count
FROM offices o
LEFT JOIN office_users ou ON o.id = ou.office_id
GROUP BY o.id, o.name, o.description
ORDER BY o.id;
```

### 2. Get office with programs (for dashboard):

```sql
SELECT
    o.id,
    o.name,
    o.description,
    jsonb_agg(
        jsonb_build_object(
            'id', p.id,
            'name', p.name,
            'status', p.status,
            'start_date', p.start_date,
            'end_date', p.end_date,
            'objective', p.objective
        )
    ) as programs
FROM offices o
LEFT JOIN programs p ON o.id = p.office_id
WHERE o.id = 1
GROUP BY o.id, o.name, o.description;
```

### 3. Login verification query:

```sql
SELECT
    id,
    email,
    office_id,
    created_at
FROM office_users
WHERE office_id = 1
  AND email = 'sdo@adzu.edu.ph'
  AND password = 'sdo123';
```

### 4. Program statistics by office:

```sql
SELECT
    o.name as office_name,
    COUNT(p.id) as total_programs,
    COUNT(CASE WHEN p.status = 'ongoing' THEN 1 END) as ongoing,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN p.status = 'upcoming' THEN 1 END) as upcoming
FROM offices o
LEFT JOIN programs p ON o.id = p.office_id
GROUP BY o.id, o.name
ORDER BY o.id;
```

---

## 💡 Key Features

### ✅ **What Works Now:**

- **Simple integer IDs** (1-6) instead of UUIDs
- **Exact column names** that match frontend expectations
- **Proper foreign key relationships** with CASCADE DELETE
- **RLS policies** that allow frontend access
- **Sample data** for all 6 offices with realistic programs

### 🎯 **Login Credentials:**

- SDO: `sdo@adzu.edu.ph` / `sdo123`
- CCES: `cces@adzu.edu.ph` / `cces123`
- API: `api@adzu.edu.ph` / `api123`
- SACSI: `sacsi@adzu.edu.ph` / `sacsi123`
- ACLG: `aclg@adzu.edu.ph` / `aclg123`
- ACCA: `acca@adzu.edu.ph` / `acca123`

### 🚀 **Frontend Compatibility:**

- Office selection uses IDs 1-6
- Login works with office_id lookup
- Dashboard loads programs with correct column names
- Statistics calculated from program status values

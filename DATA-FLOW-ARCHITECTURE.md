# 📊 AdZU SDU Data Flow Architecture Guide

> **Complete guide to understanding how data flows between frontend and backend, where to create new components, and how queries work**

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────┘

Frontend (React/Vite)           Backend (Express.js)              Database
┌─────────────────────┐        ┌──────────────────────┐         ┌─────────────┐
│  📱 Components      │   →    │  🛣️  Routes          │    →   │ 🗄️ Supabase │
│  🎣 Custom Hooks    │   ←    │  🎛️  Controllers     │    ←   │             │
│  🔄 React Query     │        │  🔐 Middleware       │         │             │
└─────────────────────┘        └──────────────────────┘         └─────────────┘
```

---

## 📂 Directory Structure & File Locations

### 🖥️ **Backend Structure**

```
📁 backend/src/
├── 📁 config/
│   └── 📄 database.js              # Supabase connection setup
├── 📁 controllers/
│   ├── 📄 authController.js        # Authentication logic
│   └── 📄 secureAuthController.js  # Secure JWT auth
├── 📁 middleware/
│   ├── 📄 auth.js                  # JWT verification middleware
│   └── 📄 rateLimiter.js          # Rate limiting
├── 📁 routes/                      # 🔥 MAIN API ENDPOINTS
│   ├── 📄 auth.js                  # Authentication routes
│   ├── 📄 office.js               # Office data queries
│   ├── 📄 program.js              # Program CRUD & queries
│   ├── 📄 unitDirector.js         # Unit director operations
│   └── 📄 secureAuth.js           # Secure authentication
├── 📁 services/
│   └── 📄 tokenService.js         # JWT token management
└── 📄 server.js                   # Express app setup
```

### ⚛️ **Frontend Structure**

```
📁 frontend/src/
├── 📁 hooks/                       # 🔥 DATA FETCHING HOOKS
│   ├── 📄 useApi.js               # Main API query hooks
│   ├── 📄 useAuth.js              # Authentication hooks
│   └── 📄 useAuthQuery.js         # Auth-related queries
├── 📁 pages/                       # 🔥 MAIN PAGES/SCREENS
│   ├── 📄 Welcome/                # Landing page
│   ├── 📄 OfficeLogin/            # Office user login
│   ├── 📄 UnitDirectorLogin/      # Unit director login
│   ├── 📄 OfficeSelection/        # Office selection screen
│   ├── 📄 OfficeDashboard/        # Office management dashboard
│   ├── 📄 UnitDirectorDashboard/  # Unit director overview
│   └── 📄 UnitDirectorReports/    # Reports & analytics
├── 📁 components/                  # 🔥 REUSABLE COMPONENTS
│   ├── 📄 Layout.jsx              # Main app layout wrapper
│   ├── 📄 Navbar.jsx              # Navigation component
│   ├── 📄 Sidebar.jsx             # Sidebar navigation
│   ├── 📄 ProtectedRoute.jsx      # Route authentication
│   ├── 📄 UserManagement.jsx      # User CRUD operations
│   └── 📄 CreateUserDialog.jsx    # User creation modal
├── 📁 context/
│   └── 📄 AuthContext.jsx         # Global authentication state
├── 📁 services/
│   ├── 📄 authService.js          # Authentication API calls
│   └── 📄 secureAuthService.js    # Secure auth implementation
└── 📁 utils/
    └── 📄 passwordUtils.js        # Password validation helpers
```

---

## 🔄 Data Flow Patterns

### 1. **Component → Hook → API → Database**

```javascript
// 🔥 TYPICAL DATA FLOW EXAMPLE

// 📱 STEP 1: Component requests data
const OfficePrograms = ({ officeId }) => {
  const { data: programs, isLoading } = useOfficePrograms(officeId);
  
  return (
    <div>
      {programs?.map(program => <ProgramCard key={program.id} program={program} />)}
    </div>
  );
};

// 🎣 STEP 2: Custom hook handles the request
// File: frontend/src/hooks/useApi.js
export const useOfficePrograms = (officeId) => {
  return useQuery({
    queryKey: QUERY_KEYS.officePrograms(officeId),
    queryFn: async () => {
      const data = await apiCall(`/office/${officeId}/programs`);
      return data.programs;
    },
    enabled: !!officeId,
    staleTime: 2 * 60 * 1000,
  });
};

// 🛣️ STEP 3: Backend route processes request
// File: backend/src/routes/office.js
router.get("/:officeId/programs", authenticateToken, async (req, res) => {
  const { officeId } = req.params;
  
  const { data: programs, error } = await supabase
    .from("programs")
    .select("*")
    .eq("office_id", officeId)
    .order("created_at", { ascending: false });
    
  res.json({ programs });
});

// 🗄️ STEP 4: Database returns filtered data
```

### 2. **Query Parameters & Filtering**

```javascript
// 🔥 FILTERING EXAMPLE

// 📱 Frontend Component with filters
const ReportsPage = () => {
  const [filters, setFilters] = useState({
    status: 'ongoing',
    office_id: 1,
    year: 2025
  });
  
  const { data: programs } = useAllPrograms(filters);
  
  return (
    <div>
      <FilterControls filters={filters} onChange={setFilters} />
      <ProgramsList programs={programs} />
    </div>
  );
};

// 🎣 Hook converts filters to query string
// File: frontend/src/hooks/useApi.js
export const useAllPrograms = (filters = {}) => {
  return useQuery({
    queryKey: ["all-programs", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? `/program/all?${queryParams}` : "/program/all";
      const data = await apiCall(endpoint);
      return data.programs;
    }
  });
};

// 🛣️ Backend processes query parameters
// File: backend/src/routes/program.js
router.get("/all", authenticateToken, async (req, res) => {
  const { status, office_id, year } = req.query;
  
  let query = supabase
    .from("programs")
    .select("*, offices(name)")
    .order("created_at", { ascending: false });

  // Apply filters dynamically
  if (status) query = query.eq("status", status);
  if (office_id) query = query.eq("office_id", office_id);
  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte("start_date", startDate).lte("start_date", endDate);
  }

  const { data: programs, error } = await query;
  res.json({ programs });
});
```

---

## 🎯 Current API Endpoints & Query Support

### **Authentication Routes** (`/api/auth/`)
- `POST /api/auth/login/office` - Office user login
- `POST /api/auth/login/unit-director` - Unit director login  
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify session

### **Office Routes** (`/api/office/`)
- `GET /api/office/all` - Get all offices (public)
- `GET /api/office/all-with-programs` - Offices with program counts (auth required)
- `GET /api/office/:id/dashboard` - Office dashboard data
- `GET /api/office/:id/programs` - Programs for specific office

### **Program Routes** (`/api/program/`)
- `GET /api/program/all?status&office_id&year` - **🔥 SUPPORTS QUERIES**
- `POST /api/program/` - Create new program
- `PUT /api/program/:id` - Update program
- `DELETE /api/program/:id` - Delete program

### **Unit Director Routes** (`/api/unit-director/`)
- `GET /api/unit-director/dashboard` - Dashboard overview
- `GET /api/unit-director/reports?month&year` - **🔥 SUPPORTS QUERIES**

### **Health Routes**
- `GET /` - Basic health check
- `GET /api/health` - Detailed health check

---

## 🚀 How to Create New Components/Pages

### **📱 Creating a New Frontend Page**

#### **Step 1: Create the Page Component**
```bash
# Create new page directory
mkdir frontend/src/pages/NewFeature
```

```jsx
// File: frontend/src/pages/NewFeature/index.jsx
import React, { useState } from 'react';
import { useNewFeatureData } from '@/hooks/useApi';
import Layout from '@/components/Layout';

const NewFeaturePage = () => {
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useNewFeatureData(filters);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout>
      <h1>New Feature</h1>
      {/* Your component content */}
    </Layout>
  );
};

export default NewFeaturePage;
```

#### **Step 2: Add Route to App**
```jsx
// File: frontend/src/App.jsx
import NewFeaturePage from './pages/NewFeature';

// Add to your router
<Route path="/new-feature" element={<NewFeaturePage />} />
```

#### **Step 3: Create API Hook**
```javascript
// File: frontend/src/hooks/useApi.js

// Add to QUERY_KEYS object
export const QUERY_KEYS = {
  // ... existing keys
  newFeature: ["new-feature"],
  newFeatureFiltered: (filters) => ["new-feature", filters],
};

// Add your new hook
export const useNewFeatureData = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.newFeatureFiltered(filters),
    queryFn: async () => {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams 
        ? `/new-feature?${queryParams}` 
        : "/new-feature";
      const data = await apiCall(endpoint);
      return data.items;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### **🛣️ Creating a New Backend Route**

#### **Step 1: Create Route File**
```javascript
// File: backend/src/routes/newFeature.js
const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const supabase = require("../config/database");

const router = express.Router();

// GET endpoint with query support
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, category, year } = req.query;

    let query = supabase
      .from("your_table")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);
    if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    }

    const { data: items, error } = await query;
    
    if (error) throw error;
    
    res.json({ items });
  } catch (error) {
    console.error("New feature error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST endpoint for creating
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    const { data: item, error } = await supabase
      .from("your_table")
      .insert([{ title, description, status }])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json({ item });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
```

#### **Step 2: Register Route in Server**
```javascript
// File: backend/src/server.js
const newFeatureRoutes = require("./routes/newFeature");

// Add to route registration
app.use("/api/new-feature", newFeatureRoutes);
```

### **🔧 Creating Reusable Components**

#### **Step 1: Create Component**
```jsx
// File: frontend/src/components/NewFeatureCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const NewFeatureCard = ({ item, onEdit, onDelete }) => {
  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h6">{item.title}</Typography>
        <Typography variant="body2">{item.description}</Typography>
        <Button onClick={() => onEdit(item)}>Edit</Button>
        <Button onClick={() => onDelete(item.id)} color="error">Delete</Button>
      </CardContent>
    </Card>
  );
};

export default NewFeatureCard;
```

#### **Step 2: Add CRUD Hooks**
```javascript
// File: frontend/src/hooks/useApi.js

// Create mutation
export const useCreateNewFeatureItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData) => {
      const data = await apiCall("/new-feature", {
        method: "POST",
        body: JSON.stringify(itemData),
      });
      return data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.newFeature,
      });
    },
  });
};

// Update mutation
export const useUpdateNewFeatureItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const data = await apiCall(`/new-feature/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      return data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.newFeature,
      });
    },
  });
};

// Delete mutation
export const useDeleteNewFeatureItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiCall(`/new-feature/${id}`, {
        method: "DELETE",
      });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.newFeature,
      });
    },
  });
};
```

---

## 🔐 Authentication Flow

### **Frontend Authentication Pattern**
```jsx
// 🔥 PROTECTED PAGE PATTERN
import { ProtectedRoute } from '@/components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

// 🔥 USE AUTH HOOK IN COMPONENTS
const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return <LoginPage />;
  
  return <div>Welcome {user.name}!</div>;
};
```

### **Backend Authentication Pattern**
```javascript
// 🔥 PROTECT ROUTES WITH MIDDLEWARE
router.get("/protected-route", 
  authenticateToken,           // Verify JWT token
  requireRole("unit_director"), // Check user role
  async (req, res) => {
    // Access user data via req.user
    const userId = req.user.userId;
    const userRole = req.user.userType;
    
    // Your protected logic here
  }
);
```

---

## 📊 Database Query Patterns

### **Basic Queries**
```javascript
// Simple select
const { data, error } = await supabase
  .from("programs")
  .select("*");

// With conditions
const { data, error } = await supabase
  .from("programs")  
  .select("*")
  .eq("status", "ongoing")
  .eq("office_id", officeId);

// With joins
const { data, error } = await supabase
  .from("programs")
  .select(`
    *,
    offices(name),
    office_users(name)
  `);
```

### **Advanced Queries**
```javascript
// Date range filtering
const { data, error } = await supabase
  .from("programs")
  .select("*")
  .gte("created_at", startDate)
  .lte("created_at", endDate);

// Text search
const { data, error } = await supabase
  .from("programs")
  .select("*")
  .ilike("title", `%${searchTerm}%`);

// Ordering and limiting
const { data, error } = await supabase
  .from("programs")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(10);
```

---

## 🚨 Best Practices & Tips

### **📱 Frontend Best Practices**

1. **Always use custom hooks for API calls**
   ```javascript
   // ❌ Don't do this in components
   useEffect(() => {
     fetch('/api/programs').then(res => res.json()).then(setPrograms);
   }, []);
   
   // ✅ Do this instead
   const { data: programs } = useOfficePrograms(officeId);
   ```

2. **Use React Query for caching and synchronization**
   ```javascript
   // Automatic caching, loading states, and error handling
   const { data, isLoading, error } = useQuery({
     queryKey: ['programs', officeId],
     queryFn: () => apiCall(`/office/${officeId}/programs`),
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

3. **Handle loading and error states**
   ```jsx
   if (isLoading) return <CircularProgress />;
   if (error) return <Alert severity="error">{error.message}</Alert>;
   ```

### **🛣️ Backend Best Practices**

1. **Always validate input parameters**
   ```javascript
   const { status, office_id } = req.query;
   
   // Validate enum values
   if (status && !['ongoing', 'completed', 'upcoming'].includes(status)) {
     return res.status(400).json({ error: 'Invalid status' });
   }
   ```

2. **Use middleware for common functionality**
   ```javascript
   // Authentication, rate limiting, validation
   router.get("/", 
     authenticateToken,
     requireRole("unit_director"),
     validateQuery,
     async (req, res) => { /* handler */ }
   );
   ```

3. **Handle errors consistently**
   ```javascript
   try {
     const { data, error } = await supabase.from("table").select("*");
     if (error) throw error;
     res.json({ data });
   } catch (error) {
     console.error("Route error:", error);
     res.status(500).json({ error: "Server error" });
   }
   ```

### **🗄️ Database Best Practices**

1. **Use indexes for frequently queried fields**
   ```sql
   CREATE INDEX idx_programs_office_id ON programs(office_id);
   CREATE INDEX idx_programs_status ON programs(status);
   CREATE INDEX idx_programs_created_at ON programs(created_at);
   ```

2. **Limit data selection**
   ```javascript
   // ❌ Don't select everything if not needed
   .select("*")
   
   // ✅ Select only required fields
   .select("id, title, status, created_at")
   ```

---

## 🎯 Quick Reference

### **File Creation Checklist**

#### **New Frontend Page:**
- [ ] Create page component in `frontend/src/pages/PageName/index.jsx`
- [ ] Add route in `App.jsx`
- [ ] Create API hook in `useApi.js`
- [ ] Add to navigation if needed

#### **New Backend Route:**
- [ ] Create route file in `backend/src/routes/routeName.js`
- [ ] Add route registration in `server.js`
- [ ] Add authentication middleware if needed
- [ ] Test with curl/Postman

#### **New Component:**
- [ ] Create component in `frontend/src/components/ComponentName.jsx`
- [ ] Add necessary props and prop-types
- [ ] Create CRUD hooks if needed
- [ ] Add to component exports

### **Common Patterns**

```javascript
// API Call Pattern
const { data, isLoading, error } = useApiHook(params);

// Mutation Pattern  
const mutation = useMutation({
  mutationFn: apiCall,
  onSuccess: () => queryClient.invalidateQueries()
});

// Route Pattern
router.get("/endpoint", middleware, async (req, res) => {
  // Handle request
});
```

---

## 📝 Summary

This architecture provides:

- ✅ **Separation of Concerns**: Clear distinction between data fetching, UI, and business logic
- ✅ **Type Safety**: Consistent data structures across frontend and backend  
- ✅ **Caching**: React Query handles caching and synchronization
- ✅ **Authentication**: JWT-based security with role-based access
- ✅ **Scalability**: Easy to add new features and endpoints
- ✅ **Real-time**: Foundation for real-time updates via polling/websockets

**Happy coding! 🚀**

# Role-Based Dashboard Implementation

## Overview

Implementasi sistem dashboard multi-role dengan single entry point `/dashboard` yang menggunakan role dari JWT token untuk menentukan layout dan komponen yang ditampilkan.

## Architecture

### 1. Smart Layout Switching

**File**: `src/app/dashboard/layout.tsx`

- Student: Menggunakan layout existing dengan `NavbarUserDashboard`
- Non-student: Menggunakan sidebar layout dengan `AppSidebar`
- Role detection dari JWT session (`user.role`)

### 2. Role-Based Dashboard Router

**File**: `src/app/dashboard/page.tsx`

- Single entry point yang mendeteksi role dari session
- Switch statement untuk render komponen dashboard yang sesuai
- Error handling untuk unknown roles

### 3. Dashboard Components

**Directory**: `src/components/dashboards/`

#### Created Components:

- `StudentDashboard.tsx` - Existing UserProfile dengan wrapper
- `AdminDashboard.tsx` - User management, system settings, analytics
- `TeacherDashboard.tsx` - Student monitoring, class analytics, mood tracking
- `CounselorDashboard.tsx` - Mental health tracking, crisis alerts, intervention tools
- `HeadTeacherDashboard.tsx` - School-wide analytics, teacher management
- `SuperDashboard.tsx` - Multi-school management, platform administration

### 4. Role-Based Sidebar Navigation

**File**: `src/components/app-sidebar.tsx`

- Dynamic navigation berdasarkan user role
- Role-specific menu items dan sub-menus
- Icons dan proper structure untuk setiap role

#### Navigation Structure:

- **Admin**: User Management, School Management, Reports & Analytics, Settings
- **Teacher**: My Students, Classes, Reports, Communication
- **Counselor**: Student Cases, Mental Health, Sessions, Reports
- **Head Teacher**: School Overview, Staff Management, Academic Management, Reports
- **Super**: Multi-School Management, Platform Administration, User Administration, Analytics

### 5. Enhanced Middleware Protection

**File**: `middleware.ts`

- Role-based route permissions
- Permission checking untuk protected routes
- Maintains existing student logic (mood check redirection)

## Role Permissions

```typescript
const rolePermissions = {
  student: [
    "/dashboard",
    "/profile",
    "/checkin",
    "/videos",
    "/education-content",
  ],
  admin: ["/dashboard", "/profile", "/videos", "/education-content"],
  teacher: ["/dashboard", "/profile", "/videos", "/education-content"],
  counselor: ["/dashboard", "/profile", "/videos", "/education-content"],
  head_teacher: ["/dashboard", "/profile", "/videos", "/education-content"],
  super: ["/dashboard", "/profile", "/videos", "/education-content"],
};
```

## Features

### ✅ Implemented

1. **Smart Layout Detection** - Automatic layout switching based on role
2. **Role-Based Dashboard Components** - Unique dashboard for each role
3. **Dynamic Sidebar Navigation** - Role-specific menu structure
4. **JWT Role Integration** - Uses existing auth system
5. **Route Protection** - Enhanced middleware with role permissions
6. **Type Safety** - Full TypeScript support
7. **Consistent Design** - Maintains existing design system

### 🎯 Key Benefits

- **Single Entry Point**: `/dashboard` works for all roles
- **Minimal Disruption**: Student experience unchanged
- **Scalable**: Easy to add new roles
- **Secure**: Role-based access control
- **Maintainable**: Modular component architecture

## Usage

### Adding New Role

1. Add role to `rolePermissions` in middleware
2. Create new dashboard component in `src/components/dashboards/`
3. Add case in dashboard page router
4. Define navigation structure in AppSidebar

### Extending Permissions

1. Update `rolePermissions` object in middleware
2. Add new protected routes as needed
3. Update navigation menus in AppSidebar

## Current Role Support

- `student` - Student dashboard with mood tracking
- `admin` - Administrative controls and user management
- `teacher` - Class management and student monitoring
- `counselor` - Mental health tracking and intervention
- `head_teacher` - School oversight and staff management
- `super` - Platform administration and multi-school management

## Notes

- Student flow tetap menggunakan existing mood check logic
- Non-student roles bypass mood check dan langsung ke dashboard
- Error handling untuk unknown/undefined roles
- Fully backward compatible dengan existing codebase

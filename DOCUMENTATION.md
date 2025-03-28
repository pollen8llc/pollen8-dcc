
# ECO8 Platform Documentation

## Overview

ECO8 is a platform designed to help users create, manage, and participate in online communities. It offers features like community profiles, knowledge bases, member management, and administrative capabilities.

## Technology Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components (built on Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query (formerly React Query)
- **Routing**: React Router DOM

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **API**: Supabase Client SDK

## Framework Architecture

### Component Structure
The application follows a component-based architecture with:
- Pages (top-level routes)
- Components (reusable UI elements)
- Layouts (page structures)
- Contexts (state management)
- Hooks (custom logic)
- Services (API interaction)
- Repositories (data access)
- Models (type definitions)

### Directory Structure
```
src/
├── components/         # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin-specific components
│   └── community/      # Community-related components
├── contexts/           # React contexts for state management
├── data/               # Mock data and data utilities
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
│   └── supabase/       # Supabase client configuration
├── lib/                # Utility functions and helpers
├── models/             # TypeScript type definitions
├── pages/              # Page components for each route
│   ├── admin/          # Admin pages
│   └── knowledge/      # Knowledge base pages
├── repositories/       # Data access layer
│   └── community/      # Community-specific data access
└── services/           # Business logic and API services
```

## Database Structure

The platform uses Supabase (PostgreSQL) with the following table structure:

### Tables

#### `profiles`
Stores user profile information:
- `id` (UUID, PK): References auth.users
- `first_name` (text): User's first name
- `last_name` (text): User's last name
- `email` (text): User's email address
- `avatar_url` (text): Profile picture URL
- `created_at` (timestamp): Account creation time
- `updated_at` (timestamp): Last profile update time

#### `communities`
Stores community information:
- `id` (UUID, PK): Unique identifier
- `name` (text): Community name
- `description` (text): Community description
- `logo_url` (text): Community logo
- `website` (text): Community website URL
- `created_at` (timestamp): Creation time
- `updated_at` (timestamp): Last update time

#### `community_members`
Manages the relationship between users and communities:
- `id` (UUID, PK): Unique identifier
- `community_id` (UUID, FK): References communities.id
- `user_id` (UUID, FK): References auth.users
- `role` (text): Member role ('admin', 'member')
- `joined_at` (timestamp): Join date

#### `knowledge_base`
Stores knowledge base articles:
- `id` (UUID, PK): Unique identifier
- `community_id` (UUID, FK): References communities.id
- `title` (text): Article title
- `content` (text): Article content
- `created_by` (UUID, FK): References auth.users
- `created_at` (timestamp): Creation time
- `updated_at` (timestamp): Last update time

#### `admin_roles`
Manages platform-level admin roles:
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK): References auth.users
- `role` (text): Admin role type
- `created_at` (timestamp): Role assignment time

#### `community_data`
Stores additional data for communities:
- `id` (UUID, PK): Unique identifier
- `community_id` (UUID, FK): References communities.id
- `data_type` (text): Type of data
- `data` (JSONB): Structured data
- `metadata` (JSONB): Additional metadata
- `imported_at` (timestamp): Import time
- `imported_by` (UUID, FK): References auth.users

### Relationships

- Users can be members of multiple communities
- Communities can have multiple members
- Communities can have multiple knowledge base articles
- Users can have different roles in different communities
- Users can have platform-level admin roles

## Authentication System

The application uses Supabase Authentication with:
- Email/password authentication
- Role-based access control
- User profile management

### User Roles
- `ADMIN`: System administrators with full access
- `ORGANIZER`: Community organizers who manage specific communities
- `MEMBER`: Regular community members
- `GUEST`: Unauthenticated/public users

## API Endpoints and Services

The application uses the Supabase JavaScript client for API access:

### User Management
- **Authentication**: Login, logout, session management
- **Profile**: Get user data, update profile

### Community Management
- **Communities**: Create, read, update communities
- **Membership**: Join, leave, manage community memberships
- **Roles**: Assign and manage community roles

### Knowledge Base
- **Articles**: Create, read, update, delete knowledge base articles
- **Access Control**: Manage article visibility and permissions

### Admin Functions
- **User Management**: Manage platform users
- **Community Oversight**: Monitor and manage communities
- **System Settings**: Configure platform settings

## Protected Routes

The application implements route protection based on user roles:

- `/profile`: Protected for authenticated users (MEMBER+)
- `/admin`: Protected for platform administrators (ORGANIZER+)
- `/admin/community/:id`: Protected for community administrators (ORGANIZER+)
- `/knowledge/:communityId`: Protected for community members (MEMBER+)

## Client-side Services

### User Service
- `getUserById`: Fetch user details
- `getCommunityOrganizers`: Get community admins
- `getCommunityMembers`: Get community members

### Community Service
- `getAllCommunities`: List all communities
- `getCommunityById`: Get community details
- `searchCommunities`: Search communities
- `getManagedCommunities`: Get communities managed by a user
- `updateCommunity`: Update community details
- `createCommunity`: Create a new community
- `joinCommunity`: Join a community
- `leaveCommunity`: Leave a community
- `makeAdmin`: Promote a user to community admin
- `removeAdmin`: Remove admin privileges

### Admin Service
- `createAdminAccount`: Create a new admin user account

## Data Flow

1. **Authentication Flow**:
   - User logs in through the Auth page
   - Supabase validates credentials and returns a session
   - UserContext stores the current user state
   - Protected routes check permissions via ProtectedRoute component

2. **Community Access Flow**:
   - Communities are fetched from the database
   - User permissions are checked against community membership
   - UI adapts based on user role and permissions

3. **Data Mutation Flow**:
   - User actions trigger service functions
   - Services call repository methods
   - Repositories interact with Supabase
   - UI updates based on React Query cache updates

## Development Guidelines

### Adding New Features
1. Define the feature requirements and user stories
2. Update TypeScript models if needed
3. Create or update database tables if required
4. Implement repository methods for data access
5. Create service methods for business logic
6. Build UI components and pages
7. Connect components to services
8. Test the feature end-to-end

### Authentication Best Practices
- Always use the ProtectedRoute component for restricted routes
- Check user roles and permissions before displaying sensitive UI
- Use the useUser hook to access the current user state
- Implement proper error handling for authentication failures

### Database Access Patterns
- Always use the repository layer to access the database
- Keep database queries in the repository files
- Use service layer to combine multiple repository calls
- Implement proper error handling for database operations

### UI Component Guidelines
- Follow the Tailwind CSS and shadcn/ui design system
- Create small, reusable components
- Use TypeScript for type safety
- Implement responsive design for all components

## Deployment

The application can be deployed using:
- Netlify for the frontend
- Supabase for backend services and database

## Appendix

### TypeScript Models

Key type definitions include:

```typescript
export enum UserRole {
  ADMIN = "ADMIN",        // System administrators
  ORGANIZER = "ORGANIZER", // Community organizers
  MEMBER = "MEMBER",      // Regular community members
  GUEST = "GUEST"         // Unauthenticated/public users
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  imageUrl: string;
  email: string;
  bio: string;
  communities: string[];
  managedCommunities?: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  memberCount: number;
  organizerIds: string[];
  memberIds: string[];
  tags: string[];
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  statistics?: CommunityStatistics;
  settings?: CommunitySettings;
  website?: string;
}
```

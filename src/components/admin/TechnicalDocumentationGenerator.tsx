import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TechnicalDocumentationGenerator = () => {
  const { toast } = useToast();

  const generateTechnicalDocumentation = () => {
    const currentDate = new Date().toLocaleDateString();
    const documentation = `# Platform Technical Documentation

Generated on: ${currentDate}

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Database Structure](#database-structure)
3. [UX/UI Design Tokens](#uxui-design-tokens)
4. [User Flows](#user-flows)
5. [Architecture Overview](#architecture-overview)

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6.26.2
- **State Management**: TanStack Query v5.56.2 for server state
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI primitives with shadcn/ui
- **Forms**: React Hook Form v7.56.2 with Zod validation
- **Icons**: Lucide React v0.462.0
- **Animations**: Framer Motion v12.7.4

### Backend & Infrastructure
- **Database**: PostgreSQL (Supabase)
- **Backend-as-a-Service**: Supabase
- **Authentication**: Supabase Auth with RLS (Row Level Security)
- **Real-time**: Supabase Realtime subscriptions
- **File Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions (Deno runtime)

### Additional Libraries
- **Data Visualization**: Recharts v2.12.7, D3.js v7.9.0
- **Text Editor**: TipTap v2.2.4 with starter kit
- **Date Handling**: date-fns v4.1.0
- **File Handling**: React Dropzone v14.3.8
- **Markdown**: markdown-to-jsx v7.7.6
- **Color Picker**: react-colorful v5.6.1
- **Notifications**: Sonner v1.5.0

## Database Structure

### Core Tables

#### Users & Authentication
\`\`\`sql
-- Profiles table (extends auth.users)
profiles (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES auth.users,
  email: text,
  first_name: text,
  last_name: text,
  full_name: text,
  bio: text,
  location: text,
  avatar_url: text,
  role: text,
  is_profile_complete: boolean,
  created_at: timestamp,
  updated_at: timestamp
)

-- User roles system
roles (
  id: uuid PRIMARY KEY,
  name: text UNIQUE,
  description: text
)

user_roles (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES auth.users,
  role_id: uuid REFERENCES roles,
  assigned_by: uuid,
  assigned_at: timestamp
)
\`\`\`

#### Communities System
\`\`\`sql
communities (
  id: uuid PRIMARY KEY,
  name: text,
  description: text,
  owner_id: uuid,
  type: text,
  location: text,
  is_public: boolean,
  tags: text[],
  created_at: timestamp
)

community_members (
  id: uuid PRIMARY KEY,
  community_id: uuid REFERENCES communities,
  user_id: uuid REFERENCES auth.users,
  role: text,
  status: text,
  joined_at: timestamp
)
\`\`\`

#### MODUL8 Service Platform
\`\`\`sql
modul8_service_providers (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES auth.users,
  business_name: text,
  tagline: text,
  description: text,
  services: text[],
  services_offered: text[],
  tags: text[],
  pricing_range: jsonb,
  domain_specializations: integer[],
  created_at: timestamp
)

modul8_service_requests (
  id: uuid PRIMARY KEY,
  organizer_id: uuid,
  service_provider_id: uuid,
  title: text,
  description: text,
  status: text,
  budget_range: text,
  timeline: text,
  created_at: timestamp
)
\`\`\`

#### Knowledge Management
\`\`\`sql
knowledge_articles (
  id: uuid PRIMARY KEY,
  title: text,
  content: text,
  content_type: text,
  author_id: uuid,
  is_published: boolean,
  tags: text[],
  vote_count: integer,
  view_count: integer,
  created_at: timestamp
)

knowledge_comments (
  id: uuid PRIMARY KEY,
  article_id: uuid REFERENCES knowledge_articles,
  author_id: uuid,
  content: text,
  parent_comment_id: uuid,
  created_at: timestamp
)
\`\`\`

### Row Level Security (RLS)
All tables implement comprehensive RLS policies ensuring:
- Users can only access their own data
- Community owners can manage their communities
- Admins have elevated access where appropriate
- Public content is accessible to authenticated users

## UX/UI Design Tokens

### Color System
\`\`\`css
:root {
  /* Primary Brand Colors */
  --primary: 174 100% 46%; /* Teal #00eada */
  --primary-foreground: 0 0% 0%;
  
  /* Background System */
  --background: 215 25% 8%; /* Dark blue-gray */
  --foreground: 0 0% 100%;
  
  /* Component Colors */
  --card: 215 25% 10%;
  --card-foreground: 0 0% 100%;
  --muted: 215 25% 12%;
  --muted-foreground: 0 0% 70%;
  
  /* Interactive States */
  --accent: 174 100% 46%;
  --accent-foreground: 0 0% 0%;
  --destructive: 0 84.2% 60.2%;
  
  /* Border System */
  --border: 215 25% 18%;
  --input: 215 25% 18%;
  --ring: 174 100% 46%;
  
  /* Border Radius */
  --radius: 1rem;
}
\`\`\`

### Typography
- **Font Family**: Inter (sans-serif)
- **Base Size**: 16px
- **Scale**: 1.125 (Major Second)
- **Line Height**: 1.5 (body), 1.2 (headings)

### Spacing System
- **Base Unit**: 0.25rem (4px)
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### Component Patterns
- **Glass Morphism**: Backdrop blur with subtle transparency
- **Gradient Overlays**: Primary to primary/80 gradients
- **Rounded Corners**: Consistent 1rem base radius
- **Shadows**: Subtle elevation with primary color hints

## User Flows

### Authentication Flow
1. **Landing** → Sign up/Sign in
2. **Email Verification** → Profile setup
3. **Role Selection** → Platform redirection
4. **Onboarding** → Feature discovery

### Platform-Specific Flows

#### ECO8 (Community Management)
\`\`\`
Community Creation:
Landing → Auth → Setup Wizard → Community Dashboard
- Basic Info → Domain Selection → Invite Methods → Review → Launch

Community Joining:
Invite Link → Auth (if needed) → Community Profile → Member Dashboard
\`\`\`

#### MODUL8 (Service Marketplace)
\`\`\`
Service Provider:
Auth → Provider Setup → Domain Specialization → Portfolio → Dashboard
- Services Offered → Pricing → Portfolio → Profile Review → Go Live

Service Request:
Organizer Setup → Request Creation → Provider Matching → Negotiation → Project Management
\`\`\`

#### LAB-R8 (Project Collaboration)
\`\`\`
Service Provider Portal:
Auth → Business Setup → Service Configuration → Request Management
- Business Info → Services → Pricing → Domain Focus → Dashboard

Project Workflow:
Request Assignment → Proposal → Negotiation → Agreement → Delivery → Completion
\`\`\`

#### REL8 (Relationship Management)
\`\`\`
Setup Flow:
Auth → Contact Import → Trigger Configuration → Dashboard
- Data Source → Column Mapping → Contact Selection → Automation Setup

Engagement Flow:
Dashboard → Contact Management → Outreach Campaigns → Analytics
\`\`\`

### Admin Flows
- **User Management**: View → Filter → Actions → Role Changes
- **Community Oversight**: Monitor → Audit → Moderate → Analytics
- **System Administration**: Metrics → Logs → Configuration → Maintenance

## Architecture Overview

### Frontend Architecture
\`\`\`
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin-specific components
│   └── [platform]/     # Platform-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API service layers
├── types/              # TypeScript type definitions
├── contexts/           # React context providers
└── utils/              # Utility functions
\`\`\`

### Backend Architecture (Supabase)
- **Database**: PostgreSQL with RLS
- **Authentication**: JWT-based with refresh tokens
- **Real-time**: WebSocket subscriptions
- **Storage**: S3-compatible object storage
- **Edge Functions**: Serverless Deno runtime
- **API**: Auto-generated REST and GraphQL APIs

### Security Architecture
- **Row Level Security**: Table-level access control
- **Role-Based Access**: Hierarchical permission system
- **JWT Tokens**: Secure authentication tokens
- **HTTPS Only**: All communications encrypted
- **CORS**: Configured for specific domains
- **Input Validation**: Zod schemas for all inputs

### Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Component Lazy Loading**: Dynamic imports
- **Image Optimization**: WebP format with fallbacks
- **Caching**: TanStack Query for server state
- **Bundle Optimization**: Vite tree-shaking
- **CSS Optimization**: Tailwind purging

### Monitoring & Analytics
- **Error Tracking**: Built-in error boundaries
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Custom event tracking
- **Database Monitoring**: Supabase dashboard
- **Real-time Metrics**: Admin dashboard analytics

### Deployment Architecture
- **Frontend**: Static site deployment
- **Backend**: Supabase cloud infrastructure
- **CDN**: Global content delivery
- **SSL**: Automatic certificate management
- **Scaling**: Auto-scaling based on demand

## Development Workflow

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and database testing
- **E2E Tests**: User journey validation
- **Performance Tests**: Load and stress testing

### CI/CD Pipeline
- **Version Control**: Git with feature branches
- **Code Review**: Pull request workflow
- **Automated Testing**: CI pipeline validation
- **Deployment**: Automated production deployment

---

*This documentation is automatically generated and reflects the current state of the platform architecture.*
`;

    // Create and download the file
    const blob = new Blob([documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-technical-documentation-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Documentation Generated",
      description: "Technical documentation has been downloaded successfully.",
    });
  };

  return (
    <Card className="glass-morphism glass-morphism-hover border border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <FileText className="h-5 w-5 text-black" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Technical Documentation
            </CardTitle>
            <CardDescription>
              Generate comprehensive platform documentation including user flows, database structure, and tech stack
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="glass-morphism p-3 rounded-xl border border-primary/10">
              <div className="font-medium text-foreground mb-1">User Flows</div>
              <div className="text-muted-foreground text-xs">Complete user journey maps</div>
            </div>
            <div className="glass-morphism p-3 rounded-xl border border-primary/10">
              <div className="font-medium text-foreground mb-1">Database Schema</div>
              <div className="text-muted-foreground text-xs">Tables, relationships & RLS</div>
            </div>
            <div className="glass-morphism p-3 rounded-xl border border-primary/10">
              <div className="font-medium text-foreground mb-1">Design Tokens</div>
              <div className="text-muted-foreground text-xs">Colors, typography & spacing</div>
            </div>
            <div className="glass-morphism p-3 rounded-xl border border-primary/10">
              <div className="font-medium text-foreground mb-1">Tech Stack</div>
              <div className="text-muted-foreground text-xs">Complete technology overview</div>
            </div>
          </div>

          <Button 
            onClick={generateTechnicalDocumentation}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-black font-medium"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Generate & Download Documentation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalDocumentationGenerator;
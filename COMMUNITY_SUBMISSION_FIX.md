# Community Submission Pipeline Fix

This document outlines the fixes implemented to resolve the issues preventing users from submitting communities using `/eco8/setup`.

## Issues Identified

1. **Missing RLS Policies**: The `community_data_distribution` table had no Row Level Security policies, preventing users from inserting data.
2. **Missing Function**: The `process_community_submission()` function was referenced but not defined.
3. **Missing Tables**: Some required tables (`community_data_distribution`, `community_members`) may not have existed.
4. **Missing Function**: The `get_user_roles()` function was referenced but not defined.

## Migrations Created

### 1. `20250101000000_create_community_data_distribution_table.sql`
- Creates the `community_data_distribution` table if it doesn't exist
- Includes proper indexes for performance
- Defines the table structure for managing community creation workflow

### 2. `20250101000000_create_community_members_table.sql`
- Creates the `community_members` table if it doesn't exist
- Includes RLS policies for secure access
- Manages community membership relationships

### 3. `20250101000000_create_get_user_roles_function.sql`
- Creates the `get_user_roles()` function
- Returns an array of role names for a given user
- Combines roles from both `user_roles` and `admin_roles` tables

### 4. `20250101000000_fix_community_submission_pipeline.sql`
- Adds RLS policies for `community_data_distribution` table
- Creates the `process_community_submission()` function
- Includes comprehensive error handling and logging

## RLS Policies Added

### community_data_distribution Table
- **Users can insert their own community submissions**: Allows users to submit community data
- **Users can view their own community submissions**: Allows users to check submission status
- **Users can update their own community submissions**: Allows status updates
- **Admins can manage all community submissions**: Allows admin oversight

### community_members Table
- **Users can view community members**: For communities they're part of
- **Users can manage their own community memberships**: Self-service membership management
- **Admins can manage all community members**: Admin oversight

## process_community_submission Function

The function performs the following steps:

1. **Status Update**: Sets submission status to 'processing'
2. **Data Extraction**: Extracts community data from JSONB submission
3. **Profile Creation**: Ensures submitter has a profile record
4. **Community Creation**: Creates the community record in `communities` table
5. **Membership Creation**: Adds creator as admin member
6. **Status Update**: Sets status to 'completed' with community ID
7. **Audit Logging**: Logs the community creation action
8. **Error Handling**: Catches and logs any errors

## How to Apply

1. **Run the migrations in order**:
   ```bash
   supabase db push
   ```

2. **Verify the setup**:
   - Check that all tables exist
   - Verify RLS policies are active
   - Test the `get_user_roles` function
   - Test community submission workflow

## Testing the Fix

1. **User Role Check**: Ensure users have the `ORGANIZER` role
2. **Community Submission**: Test the `/eco8/setup` workflow
3. **Status Polling**: Verify the submission status updates correctly
4. **Community Creation**: Confirm communities are created successfully

## Expected Workflow

1. User navigates to `/eco8/setup`
2. User fills out community form
3. System checks for `ORGANIZER` role
4. Data is submitted to `community_data_distribution`
5. Trigger calls `process_community_submission()`
6. Community is created and user is added as admin
7. Status is updated to 'completed'
8. User is redirected to dashboard

## Troubleshooting

If issues persist:

1. **Check RLS Policies**: Verify policies are active and correct
2. **Check Function Permissions**: Ensure functions have proper grants
3. **Check User Roles**: Verify users have appropriate roles
4. **Check Database Logs**: Look for error messages in Supabase logs
5. **Test Individual Components**: Test each function separately

## Security Considerations

- All functions use `SECURITY DEFINER` for proper privilege escalation
- RLS policies ensure users can only access their own data
- Admin policies allow oversight without compromising security
- Audit logging tracks all community creation activities

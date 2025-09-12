-- Update the user's profile to ensure proper admin access and complete profile setup
UPDATE public.profiles 
SET 
    is_profile_complete = true,
    profile_complete = true,
    bio = COALESCE(bio, 'System Administrator'),
    location = COALESCE(location, 'System'),
    onboarding_complete = true,
    updated_at = NOW()
WHERE user_id = '6be3fb14-9e02-4089-8fb5-ebbce0a2cf0e';

-- Ensure admin role entry exists in admin_roles table
INSERT INTO public.admin_roles (user_id, role, assigned_by, assigned_at)
VALUES (
    '6be3fb14-9e02-4089-8fb5-ebbce0a2cf0e',
    'ADMIN',
    '6be3fb14-9e02-4089-8fb5-ebbce0a2cf0e',
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    role = 'ADMIN',
    assigned_at = NOW();
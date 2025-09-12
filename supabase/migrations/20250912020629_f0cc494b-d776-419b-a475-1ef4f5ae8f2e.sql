-- Fix admin role synchronization
UPDATE public.profiles 
SET role = (
  SELECT r.name 
  FROM public.user_roles ur 
  JOIN public.roles r ON ur.role_id = r.id 
  WHERE ur.user_id = profiles.user_id 
  ORDER BY 
    CASE r.name 
      WHEN 'ADMIN' THEN 1
      WHEN 'ORGANIZER' THEN 2
      WHEN 'SERVICE_PROVIDER' THEN 3
      WHEN 'MEMBER' THEN 4
      ELSE 5
    END
  LIMIT 1
)
WHERE user_id IN (
  SELECT user_id FROM public.user_roles ur 
  JOIN public.roles r ON ur.role_id = r.id 
  WHERE r.name != COALESCE(profiles.role, 'MEMBER')
);
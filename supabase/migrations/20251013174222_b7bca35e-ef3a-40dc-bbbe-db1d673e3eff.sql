-- Create affiliation record for Alice Zheng
INSERT INTO public.rms_contact_affiliations (
  contact_id,
  user_id,
  affiliation_type,
  affiliated_user_id,
  relationship
) VALUES (
  '8d52130f-dde2-4746-a907-5864fbde0e14',  -- Alice's contact ID
  '6be3fb14-9e02-4089-8fb5-ebbce0a2cf0e',  -- The user who owns the contact
  'user',
  '4e55ef30-8e3d-46ef-8b94-cb8d95caa767',  -- Alice's actual user profile ID
  'platform_member'
);
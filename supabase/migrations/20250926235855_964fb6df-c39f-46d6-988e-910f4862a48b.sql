-- Create a secure helper to fetch only the selected avatar id for any user
create or replace function public.get_selected_avatar_id(target_user uuid)
returns uuid
language sql
security definer
set search_path = public
as $$
  select p.selected_avatar_id
  from public.profiles p
  where p.user_id = target_user
  limit 1;
$$;

-- Allow web clients to execute this function
grant execute on function public.get_selected_avatar_id(uuid) to anon, authenticated;
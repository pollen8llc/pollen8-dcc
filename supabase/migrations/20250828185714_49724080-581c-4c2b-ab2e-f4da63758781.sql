
-- 1) Drop any legacy triggers on public.communities that call validate_community_owner()
do $$
declare
  trig record;
begin
  for trig in
    select t.tgname
    from pg_trigger t
    join pg_proc p on p.oid = t.tgfoid
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace ns on ns.oid = c.relnamespace
    where ns.nspname = 'public'
      and c.relname = 'communities'
      and p.proname = 'validate_community_owner'
      and not t.tgisinternal
  loop
    execute format('drop trigger if exists %I on public.communities;', trig.tgname);
  end loop;
end
$$;

-- Also drop by common names just in case
drop trigger if exists trg_validate_community_owner on public.communities;
drop trigger if exists validate_community_owner_trigger on public.communities;

-- 2) Drop the problematic function that queries auth.users
drop function if exists public.validate_community_owner();

-- 3) Ensure the safe owner-setting function exists and is SECURITY DEFINER (no reads from auth.users)
create or replace function public.set_community_owner()
returns trigger
language plpgsql
security definer
set search_path to public
as $function$
begin
  -- Set owner_id to current user if not provided
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;

  -- Enforce that inserted owner_id matches the caller
  if new.owner_id <> auth.uid() then
    raise exception 'Cannot create community for another user';
  end if;

  return new;
end;
$function$;

-- 4) Recreate a single BEFORE INSERT trigger that sets owner_id via auth.uid()
drop trigger if exists set_owner_before_insert on public.communities;
create trigger set_owner_before_insert
before insert on public.communities
for each row
execute function public.set_community_owner();

-- 5) Reattach safe validation/standardization triggers that DO NOT read auth.users
-- (These functions already exist in your project per the current database state.)
drop trigger if exists validate_format_before_ins_upd on public.communities;
create trigger validate_format_before_ins_upd
before insert or update on public.communities
for each row
execute function public.validate_community_format();

drop trigger if exists validate_type_before_ins_upd on public.communities;
create trigger validate_type_before_ins_upd
before insert or update on public.communities
for each row
execute function public.validate_community_type();

drop trigger if exists standardize_target_audience_before_ins_upd on public.communities;
create trigger standardize_target_audience_before_ins_upd
before insert or update on public.communities
for each row
execute function public.standardize_target_audience();

drop trigger if exists communities_set_updated_at on public.communities;
create trigger communities_set_updated_at
before update on public.communities
for each row
execute function public.update_updated_at_column();

-- 6) Create a SECURITY DEFINER RPC for ORGANIZER/ADMIN creation
-- Returns the inserted community row
create or replace function public.create_community(
  p_name text,
  p_description text,
  p_type text default null,
  p_location text default 'Remote',
  p_format text default 'hybrid',
  p_website text default null,
  p_is_public boolean default true,
  p_tags text[] default array[]::text[],
  p_target_audience text[] default array[]::text[],
  p_social_media jsonb default '{}'::jsonb,
  p_communication_platforms jsonb default '{}'::jsonb
) returns public.communities
language plpgsql
security definer
set search_path to public
as $function$
declare
  v_row public.communities;
begin
  -- Only admins or organizers can create communities
  if not (public.has_role(auth.uid(), 'ADMIN') or public.has_role(auth.uid(), 'ORGANIZER')) then
    raise exception 'Only ADMIN or ORGANIZER can create communities';
  end if;

  insert into public.communities (
    name,
    description,
    type,
    location,
    format,
    website,
    is_public,
    tags,
    target_audience,
    social_media,
    communication_platforms,
    owner_id
  )
  values (
    p_name,
    p_description,
    p_type,
    coalesce(p_location, 'Remote'),
    p_format,
    p_website,
    coalesce(p_is_public, true),
    coalesce(p_tags, array[]::text[]),
    coalesce(p_target_audience, array[]::text[]),
    coalesce(p_social_media, '{}'::jsonb),
    coalesce(p_communication_platforms, '{}'::jsonb),
    auth.uid()
  )
  returning * into v_row;

  return v_row;
end;
$function$;

-- 7) Allow authenticated users to call the RPC (logic inside enforces role)
grant execute on function public.create_community(
  text, text, text, text, text, text, boolean, text[], text[], jsonb, jsonb
) to authenticated;

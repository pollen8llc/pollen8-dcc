
-- 1) Secure aggregate function to expose poll counts without revealing user IDs
create or replace function public.get_poll_counts(poll_id uuid)
returns table (option_index int, count bigint)
language sql
security definer
set search_path = public
as $$
  select
    option_index,
    count(*)::bigint as count
  from public.poll_responses
  where poll_id = get_poll_counts.poll_id
  group by option_index
  order by option_index
$$;

-- Ensure only intended roles can execute it
revoke all on function public.get_poll_counts(uuid) from public;
grant execute on function public.get_poll_counts(uuid) to anon, authenticated;

-- 2) RLS hardening for poll_responses so users can only manage their own rows
-- Enable RLS (safe to run if already enabled)
alter table public.poll_responses enable row level security;

-- Create policy: insert own responses
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'poll_responses'
      and policyname = 'Users can insert their own poll responses'
  ) then
    create policy "Users can insert their own poll responses"
      on public.poll_responses
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;

-- Create policy: delete own responses
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'poll_responses'
      and policyname = 'Users can delete their own poll responses'
  ) then
    create policy "Users can delete their own poll responses"
      on public.poll_responses
      for delete
      using (auth.uid() = user_id);
  end if;
end $$;

-- Create policy: select own responses (used only to show a logged-in user what they picked)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'poll_responses'
      and policyname = 'Users can view their own poll responses'
  ) then
    create policy "Users can view their own poll responses"
      on public.poll_responses
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

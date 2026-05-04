-- =============================================================================
-- DVF auto-revalidate trigger
-- =============================================================================
-- Fires once per INSERT/UPDATE/DELETE statement on public.dvf_sales,
-- calling the Next.js admin revalidate endpoint via pg_net (async HTTP).
--
-- Run this script ONE TIME in Supabase SQL Editor.
-- Replace REPLACE_ME_ADMIN_SECRET below with the value of ADMIN_SECRET set
-- in Vercel environment variables.
-- =============================================================================

-- 1) Enable pg_net extension (Supabase has it pre-installed but disabled).
create extension if not exists pg_net with schema extensions;

-- 2) Create the trigger function.
create or replace function public.trigger_revalidate_site()
returns trigger
language plpgsql
security definer
as $$
declare
  request_id bigint;
begin
  select net.http_post(
    url := 'https://www.ajaccio-estimation.fr/api/admin/revalidate',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer REPLACE_ME_ADMIN_SECRET'
    ),
    body := jsonb_build_object(
      'source', 'supabase-trigger',
      'table', TG_TABLE_NAME,
      'op', TG_OP,
      'occurredAt', now()
    )
  ) into request_id;

  return null;
end;
$$;

-- 3) Drop existing trigger if any, then create statement-level trigger.
drop trigger if exists dvf_sales_after_change on public.dvf_sales;

create trigger dvf_sales_after_change
after insert or update or delete on public.dvf_sales
for each statement
execute function public.trigger_revalidate_site();

-- =============================================================================
-- Verify setup:
--   select * from pg_trigger where tgname = 'dvf_sales_after_change';
-- Inspect recent HTTP calls:
--   select * from net._http_response order by id desc limit 10;
-- =============================================================================

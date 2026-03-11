-- Shared views table: stores filter params + slug for sharing any filtered view
create table public.shared_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  collection_id uuid references public.collections(id) on delete cascade,
  collection_uncategorized boolean not null default false,
  filter text check (filter in ('read', 'unread')),
  priority text check (priority in ('urgent', 'high', 'normal', 'low')),
  sort text check (sort in ('priority')),
  search text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_shared_views_slug on public.shared_views(slug);
create index idx_shared_views_user_id on public.shared_views(user_id);

alter table public.shared_views enable row level security;

-- Authenticated users can CRUD their own shared views
create policy "Users can view own shared views"
  on public.shared_views for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own shared views"
  on public.shared_views for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own shared views"
  on public.shared_views for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own shared views"
  on public.shared_views for delete to authenticated
  using (auth.uid() = user_id);

-- Anon users can read active shared views (needed to look up share pages)
create policy "Anyone can view active shared views"
  on public.shared_views for select to anon
  using (is_active = true);

-- Security definer function: bypasses RLS to return only matching bookmarks
create or replace function public.get_shared_bookmarks(view_slug text)
returns setof public.bookmarks
language plpgsql security definer
as $$
declare
  v record;
  q text;
begin
  select * into v from public.shared_views
  where slug = view_slug and is_active = true;

  if not found then
    return;
  end if;

  q := 'select * from public.bookmarks where user_id = ' || quote_literal(v.user_id);

  if v.collection_uncategorized then
    q := q || ' and collection_id is null';
  elsif v.collection_id is not null then
    q := q || ' and collection_id = ' || quote_literal(v.collection_id);
  end if;

  if v.filter = 'unread' then
    q := q || ' and is_read = false';
  elsif v.filter = 'read' then
    q := q || ' and is_read = true';
  end if;

  if v.priority is not null then
    q := q || ' and priority = ' || quote_literal(v.priority);
  end if;

  if v.search is not null and v.search <> '' then
    q := q || ' and (title ilike ' || quote_literal('%' || v.search || '%')
           || ' or description ilike ' || quote_literal('%' || v.search || '%')
           || ' or url ilike ' || quote_literal('%' || v.search || '%')
           || ' or site_name ilike ' || quote_literal('%' || v.search || '%') || ')';
  end if;

  if v.sort = 'priority' then
    q := q || ' order by priority_order asc, created_at desc';
  else
    q := q || ' order by created_at desc';
  end if;

  return query execute q;
end;
$$;

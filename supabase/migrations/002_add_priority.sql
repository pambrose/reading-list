-- Add priority field to bookmarks
alter table public.bookmarks
  add column priority text not null default 'normal'
  check (priority in ('urgent', 'high', 'normal', 'low'));

-- Computed column for correct sort ordering (urgent=0 first, low=3 last)
alter table public.bookmarks
  add column priority_order smallint generated always as (
    case priority
      when 'urgent' then 0
      when 'high'   then 1
      when 'normal' then 2
      when 'low'    then 3
    end
  ) stored;

-- Index for filtering by priority
create index idx_bookmarks_priority on public.bookmarks(user_id, priority);

-- Index for sorting by priority (covers ORDER BY priority_order, created_at DESC)
create index idx_bookmarks_priority_order on public.bookmarks(user_id, priority_order, created_at desc);

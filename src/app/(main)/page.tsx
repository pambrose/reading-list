import { createClient } from "@/lib/supabase/server";
import { UrlInput } from "@/components/bookmarks/url-input";
import { CollectionTabs } from "@/components/collections/collection-tabs";
import { FilterTabs } from "@/components/bookmarks/filter-tabs";
import { BookmarkList } from "@/components/bookmarks/bookmark-list";
import { CollectionMenu } from "@/components/collections/collection-menu";
import { PRIORITY_LEVELS } from "@/lib/utils/priority";
import type { Bookmark, Collection } from "@/types/database";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; filter?: string; priority?: string; sort?: string }>;
}) {
  const { collection, filter, priority, sort } = await searchParams;
  const supabase = await createClient();

  // Fetch collections
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: true });

  // Build bookmarks query
  let query = supabase
    .from("bookmarks")
    .select("*");

  if (collection === "uncategorized") {
    query = query.is("collection_id", null);
  } else if (collection) {
    query = query.eq("collection_id", collection);
  }

  if (filter === "unread") {
    query = query.eq("is_read", false);
  } else if (filter === "read") {
    query = query.eq("is_read", true);
  }

  if (priority && (PRIORITY_LEVELS as readonly string[]).includes(priority)) {
    query = query.eq("priority", priority);
  }

  if (sort === "priority") {
    query = query
      .order("priority_order", { ascending: true })
      .order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: bookmarks } = await query;

  const typedCollections = (collections || []) as Collection[];
  const typedBookmarks = (bookmarks || []) as Bookmark[];

  // Find the active collection for the menu
  const activeCollection = collection && collection !== "uncategorized"
    ? typedCollections.find((c) => c.id === collection)
    : null;

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <UrlInput collections={typedCollections} />

      {/* Collection tabs + menu */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <CollectionTabs collections={typedCollections} />
        </div>
        {activeCollection && <CollectionMenu collection={activeCollection} />}
      </div>

      {/* Filter tabs */}
      <FilterTabs />

      {/* Bookmark list */}
      <BookmarkList bookmarks={typedBookmarks} collections={typedCollections} />
    </div>
  );
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
}

import type { Priority } from "@/lib/utils/priority";

export interface Bookmark {
  id: string;
  user_id: string;
  collection_id: string | null;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
  repo_stars: number | null;
  repo_forks: number | null;
  repo_language: string | null;
  is_read: boolean;
  priority: Priority;
  created_at: string;
}

export interface SharedView {
  id: string;
  user_id: string;
  slug: string;
  collection_id: string | null;
  collection_uncategorized: boolean;
  filter: string | null;
  priority: string | null;
  sort: string | null;
  search: string | null;
  title: string | null;
  is_active: boolean;
  created_at: string;
}

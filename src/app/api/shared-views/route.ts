import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateShareSlug } from "@/lib/utils/slug";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    collection_id,
    collection_uncategorized,
    filter,
    priority,
    sort,
    search,
    title,
  } = body;

  // Always create a new shared view (title makes each share unique)
  const slug = generateShareSlug();
  const { data, error } = await supabase
    .from("shared_views")
    .insert({
      user_id: user.id,
      slug,
      collection_id: collection_id || null,
      collection_uncategorized: !!collection_uncategorized,
      filter: filter || null,
      priority: priority || null,
      sort: sort || null,
      search: search || null,
      title: title || null,
    })
    .select("slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    slug: data.slug,
    url: `/share/${data.slug}`,
  }, { status: 201 });
}

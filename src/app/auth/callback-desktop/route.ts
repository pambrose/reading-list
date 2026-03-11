import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifySlackUserLogin } from "@/lib/utils/slack";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const port = searchParams.get("port");

  if (code) {
    const supabase = await createClient();
    const { data: sessionData, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error && sessionData?.session) {
      // Ensure default collections exist for the user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const defaultCollections = ["Videos", "Tweets", "Articles", "Repos"];
        const { data: existing } = await supabase
          .from("collections")
          .select("name")
          .eq("user_id", user.id)
          .in("name", defaultCollections);
        const existingNames = new Set((existing || []).map((c) => c.name));
        const missing = defaultCollections.filter(
          (name) => !existingNames.has(name)
        );
        if (missing.length > 0) {
          await supabase
            .from("collections")
            .insert(missing.map((name) => ({ user_id: user.id, name })));
        }
        await notifySlackUserLogin({
          email: user.email,
          name: user.user_metadata?.full_name,
          provider: user.app_metadata?.provider,
        });
      }

      // Redirect tokens to Electron's local auth server
      if (port) {
        const { access_token, refresh_token } = sessionData.session;
        return NextResponse.redirect(
          `http://127.0.0.1:${port}/auth/callback?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`
        );
      }

      return NextResponse.redirect(`${origin}/`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

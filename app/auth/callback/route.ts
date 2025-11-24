import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      // If no profile exists, create one with OAuth user data
      if (!profile) {
        const fullName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          "";

        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          role: "owner", // Default role for OAuth users
        });
      }

      // Redirect to homepage after successful login
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // If there's an error or no code, redirect to login page
  return NextResponse.redirect(`${origin}/auth/login`);
}

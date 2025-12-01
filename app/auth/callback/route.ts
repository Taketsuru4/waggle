import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error_param = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  const origin = requestUrl.origin;

  console.log("[OAuth Callback] Received:", {
    code: code ? "present" : "missing",
    error: error_param,
    error_description,
    origin,
  });

  // Check for OAuth errors from provider
  if (error_param) {
    console.error(
      "[OAuth Callback] Provider error:",
      error_param,
      error_description,
    );
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error_description || error_param)}`,
    );
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("[OAuth Callback] Exchange result:", {
      hasData: !!data,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: error?.message,
    });

    if (error) {
      console.error("[OAuth Callback] Exchange error:", error);
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(error.message)}`,
      );
    }

    if (data.user) {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      console.log("[OAuth Callback] Profile check:", {
        exists: !!profile,
        error: profileError?.message,
      });

      // If no profile exists, create one with OAuth user data
      if (!profile) {
        const fullName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          "";

        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          role: "owner", // Default role for OAuth users
        });

        console.log("[OAuth Callback] Profile creation:", {
          success: !insertError,
          error: insertError?.message,
        });
      }

      // Redirect to homepage after successful login
      console.log("[OAuth Callback] Success! Redirecting to home");
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // If there's an error or no code, redirect to login page
  console.log("[OAuth Callback] No code provided, redirecting to login");
  return NextResponse.redirect(`${origin}/auth/login`);
}

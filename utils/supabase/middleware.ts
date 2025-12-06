import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Cek User saat ini
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Proteksi Rute (Guard)
 // 1. Definisikan Rute Publik (Boleh diakses tanpa login)
  const isPublicRoute = 
    request.nextUrl.pathname === "/" || // <--- Dashboard dibuka
    request.nextUrl.pathname.startsWith("/login") || 
    request.nextUrl.pathname.startsWith("/auth");

  // 2. Jika USER BELUM LOGIN dan mencoba masuk Rute RAHASIA (Bukan Public)
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3. Jika USER SUDAH LOGIN dan mencoba buka halaman Login
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return response;
}
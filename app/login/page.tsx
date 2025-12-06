import { login } from "./actions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">
          Login Admin
        </h1>

        {/* Menampilkan Pesan Error jika ada */}
        {searchParams?.message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
            {searchParams.message}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="admin@pupuk.com"
              required
              className="mt-1 w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="mt-1 w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Tombol memanggil Server Action */}
          <button
            formAction={login}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Masuk
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <a href="/" className="hover:underline">← Kembali ke Dashboard</a>
        </p>
      </div>
    </div>
  );
}
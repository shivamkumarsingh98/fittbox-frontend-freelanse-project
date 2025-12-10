"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setAdminAuth,
  setAdminLoading,
  setAdminError,
} from "../../redux/slices/adminAuthSlice";
import { adminLogin } from "../../api/admin";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoadingLocal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoadingLocal(true);
    dispatch(setAdminLoading(true));
    try {
      const data = await adminLogin({ email, password });
      // backend returns token and optionally admin user
      const token = data?.token || data?.data?.token || null;
      if (!token) throw new Error(data?.message || "No token returned");

      // Only store admin info locally on localhost for easier dev testing.
      const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");
      let admin = null;
      if (isLocal) {
        admin = data?.admin || {
          name: email,
          email,
          role: data?.admin?.role || "admin",
        };
      }
      dispatch(setAdminAuth({ admin, token }));
      router.push("/Dashboard/Admin");
    } catch (err) {
      const msg = err?.message || "Login failed";
      setError(msg);
      dispatch(setAdminError(msg));
    } finally {
      setLoadingLocal(false);
      dispatch(setAdminLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-red-900 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 ">
        {/* Left hero */}
        <div className="hidden md:flex items-center justify-center rounded-l-3xl bg-gradient-to-br from-black to-red-700 p-8 shadow-2xl">
          <div className="text-white text-center">
            <div className="text-4xl font-extrabold mb-2">Admin Portal</div>
            <p className="opacity-90 mb-6">
              Manage users, subscriptions and site settings
            </p>
            <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3 3 3-1.343 3-3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"
                />
              </svg>
              <span className="text-sm font-semibold">Secure Access</span>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="bg-white rounded-r-3xl p-8 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Admin Sign In</h2>
              <div className="text-sm text-neutral-500">Secure</div>
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              Enter your admin credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full border-2 border-neutral-100 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                placeholder="admin@yourdomain.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full border-2 border-neutral-100 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              {/* <a href="#" className="text-sm text-red-600 font-medium">
                Forgot?
              </a> */}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-black to-red-600 text-white font-semibold py-3 rounded-2xl shadow-lg disabled:opacity-60"
              >
                {loading ? (
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeOpacity="0.25"
                      strokeWidth="4"
                    ></circle>
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 opacity-80"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                    />
                    <circle cx="12" cy="7" r="4" strokeWidth={2} />
                  </svg>
                )}
                <span>{loading ? "Signing in..." : "Sign In"}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            By signing in you agree to the admin policies.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;

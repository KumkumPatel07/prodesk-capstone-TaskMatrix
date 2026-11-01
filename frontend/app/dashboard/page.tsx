"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading Dashboard...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-blue-400">
          TaskMatrix
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-5 py-2 font-medium hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <section className="mx-auto mt-12 max-w-6xl">
        <h2 className="text-3xl font-bold">
          Welcome, {user.name}! 👋
        </h2>

        <p className="mt-2 text-slate-400">
          Your workspace is ready. Manage your projects smarter with TaskMatrix.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">My Projects</h3>
            <p className="mt-2 text-sm text-slate-400">
              Manage all your projects in one place.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">My Tasks</h3>
            <p className="mt-2 text-sm text-slate-400">
              Keep track of your daily tasks.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">My Workspace</h3>
            <p className="mt-2 text-sm text-slate-400">
              Collaborate and organize your work.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Account Details</h3>
          <p className="mt-3 text-slate-300">Name: {user.name}</p>
          <p className="mt-2 text-slate-300">Email: {user.email}</p>
        </div>
      </section>
    </main>
  );
}
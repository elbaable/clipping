"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  type User = {
    userId: string;
    email: string;
  };

  const [user, setUser] = useState<User | null>(null); // ✅ Explicitly define the type
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/checked");
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user as User); // ✅ Type assertion for safety
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold">Welcome to the Platform</h1>

      {user ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Welcome, {user.email}!</h2>
          <p>Your User ID: {user.userId}</p>
          <button
            onClick={handleLogout}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="mt-2">
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>{" "}
          to access your dashboard.
        </p>
      )}
    </div>
  );
}

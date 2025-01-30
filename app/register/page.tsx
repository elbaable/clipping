"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push("/verify-email"); // Redirect to verify-email page on successful registration
            } else {
                const { error } = await res.json();
                setError(error || "Something went wrong.");
            }
        } catch (err) {
        setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="p-6 bg-white rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                />
                </div>

                <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                />
                </div>

                <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                />
                </div>

                <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                Register
                </button>

                <p className="text-center mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                    Login
                </Link>
                </p>
            </form>
        </div>
    );
}

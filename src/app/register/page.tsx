"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, UserPlus, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Auto login after registration
      const loginResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!loginResult?.error) {
        router.push("/colleges");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create an Account</h1>
        <p className="text-xs text-gray-500">Join CampusPulse to discover colleges & save comparisons.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleRegister} className="space-y-4">
          {errorMsg ? (
            <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-200">
              {errorMsg}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">Full Name</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-9 text-sm"
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">Email Address</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9 text-sm"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">Password</Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="pl-9 text-sm"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-500 border-t border-gray-100">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

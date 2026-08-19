"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, LogIn, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setErrorMsg("Invalid email address or password.");
      } else {
        router.push("/colleges");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: "rahul@example.com",
        password: "password123",
      });

      if (!result?.error) {
        router.push("/colleges");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
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
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
        <p className="text-xs text-gray-500">Sign in to access your saved colleges and comparison sets.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Quick Demo Account Button */}
        <div className="rounded-xl bg-blue-50/80 p-4 text-center border border-blue-100 space-y-2">
          <p className="text-xs font-semibold text-blue-900">Want a instant trial?</p>
          <Button
            onClick={handleDemoQuickLogin}
            disabled={loading}
            size="sm"
            variant="outline"
            className="w-full bg-white text-blue-700 border-blue-200 font-bold hover:bg-blue-100 text-xs"
          >
            One-Click Demo Student Login
          </Button>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          {errorMsg ? (
            <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-200">
              {errorMsg}
            </div>
          ) : null}

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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <LogIn className="h-4 w-4" />
            {loading ? "Signing in..." : "Log In"}
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-500 border-t border-gray-100">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-blue-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

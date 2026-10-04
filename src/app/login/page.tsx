"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { ApiError } from "@/lib/api/client";
import { AuthAlert, AuthField, AuthShell, AuthSubmit, authInputClass } from "@/components/auth/auth-shell";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "ACCOUNT_LOCKED") return "Too many wrong tries. This account is locked for 15 minutes.";
    if (err.code === "RATE_LIMIT_EXCEEDED") return "Too many attempts. Wait a minute and try again.";
    if (err.code === "PASSWORD_CHANGE_REQUIRED")
      return "You have not set your password yet. Open the setup link the plant admin gave you.";
    if (err.status === 401) return "Wrong email or password.";
    return err.message;
  }
  return "Cannot reach the plant server. Check the network and try again.";
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // AuthProvider redirects to the user's desk once the session is set.
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to your desk"
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Your desk opens automatically based on your role.</span>
          <Link href="/request-access" className="font-semibold text-neutral-800 hover:text-[#059669] shrink-0">
            New staff? Request access →
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField id="email" label="Email">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@mahaurja.local"
              className={`${authInputClass} pl-9`}
            />
          </div>
        </AuthField>

        <AuthField id="password" label="Password">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${authInputClass} pl-9`}
            />
          </div>
        </AuthField>

        {error && <AuthAlert>{error}</AuthAlert>}

        <AuthSubmit busy={submitting} disabled={!email || !password}>
          <span>Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}

"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";
import { AuthAlert, AuthField, AuthShell, AuthSubmit, authInputClass } from "@/components/auth/auth-shell";
import { accessApi } from "@/lib/api/access";
import { ApiError, describeApiError } from "@/lib/api/client";

function SetupPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setError(null);
    setSubmitting(true);
    try {
      await accessApi.setupPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError && err.code === "INVALID_TOKEN"
          ? "This link is invalid, already used, or expired. Ask the plant admin for a new link."
          : describeApiError(err, "Cannot reach the plant server. Check the network and try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return <AuthAlert>This page needs the link the plant admin gave you.</AuthAlert>;
  }

  if (done) {
    return (
      <div className="space-y-4">
        <AuthAlert tone="success">Password set. You can sign in now.</AuthAlert>
        <Link
          href="/login"
          className="w-full h-10 bg-[#18181B] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AuthField id="password" label="New password">
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min 10 characters, letters and numbers"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={authInputClass}
        />
      </AuthField>
      <AuthField id="confirm" label="Type it again">
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={authInputClass}
        />
      </AuthField>
      {mismatch && <AuthAlert>The two passwords do not match.</AuthAlert>}
      {error && <AuthAlert>{error}</AuthAlert>}
      <AuthSubmit busy={submitting} disabled={!password || password !== confirm}>
        <span>Set Password</span>
        <KeyRound className="w-3.5 h-3.5" />
      </AuthSubmit>
    </form>
  );
}

export default function SetupPasswordPage() {
  return (
    <AuthShell title="Set your password">
      <Suspense fallback={null}>
        <SetupPasswordForm />
      </Suspense>
    </AuthShell>
  );
}

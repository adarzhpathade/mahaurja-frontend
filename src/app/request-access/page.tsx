"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { AuthAlert, AuthField, AuthShell, AuthSubmit, authInputClass } from "@/components/auth/auth-shell";
import { accessApi, REQUESTABLE_DESKS } from "@/lib/api/access";
import { ApiError, describeApiError } from "@/lib/api/client";

export default function RequestAccessPage() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [desk, setDesk] = useState(REQUESTABLE_DESKS[0].roleId);
  const [employeeCode, setEmployeeCode] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await accessApi.submit({
        fullName: fullName.trim(),
        mobile: mobile.replace(/\D/g, ""),
        requestedRoleId: desk,
        email: email.trim() || undefined,
        employeeCode: employeeCode.trim() || undefined,
        note: note.trim() || undefined,
      });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("A request for this mobile number is already waiting for approval.");
      } else if (err instanceof ApiError && err.status === 429) {
        setError("Too many requests from this device. Try again in an hour.");
      } else {
        setError(describeApiError(err, "Cannot reach the plant server. Check the network and try again."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthShell
        title="Request sent"
        footer={
          <Link href="/login" className="font-semibold text-neutral-800 hover:text-[#059669]">
            ← Back to sign in
          </Link>
        }
      >
        <AuthAlert tone="success">
          The plant admin will check your request. Once approved, you will get a link to set your password.
        </AuthAlert>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Request access"
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-neutral-800 hover:text-[#059669]">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField id="fullName" label="Full name">
          <input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={authInputClass} />
        </AuthField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthField id="mobile" label="Mobile number">
            <input
              id="mobile"
              inputMode="numeric"
              required
              placeholder="10-digit mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={`${authInputClass} font-mono`}
            />
          </AuthField>
          <AuthField id="desk" label="Desk you work at">
            <select id="desk" value={desk} onChange={(e) => setDesk(e.target.value)} className={authInputClass}>
              {REQUESTABLE_DESKS.map((d) => (
                <option key={d.roleId} value={d.roleId}>
                  {d.label}
                </option>
              ))}
            </select>
          </AuthField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthField id="email" label="Email" optional>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={authInputClass} />
          </AuthField>
          <AuthField id="employeeCode" label="EMP code" optional>
            <input id="employeeCode" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} className={`${authInputClass} font-mono`} />
          </AuthField>
        </div>

        <AuthField id="note" label="Note for admin" optional>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Night shift weighbridge operator, joined this week"
            className="w-full min-h-[56px] sm:min-h-[48px] p-3 bg-white border border-neutral-300 text-xs leading-relaxed resize-none placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]"
          />
        </AuthField>

        {error && <AuthAlert>{error}</AuthAlert>}

        <AuthSubmit busy={submitting} disabled={!fullName.trim() || mobile.replace(/\D/g, "").length !== 10}>
          <span>Send Request</span>
          <Send className="w-3.5 h-3.5" />
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}

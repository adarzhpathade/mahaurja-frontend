// Shared secret for verifying the backend-issued `mh_desk` cookie (same value as Mahaurja-Backend DESK_COOKIE_SECRET).
// Production must configure it explicitly; a missing secret would let anyone forge desk cookies.
const DEV_FALLBACK = "mahaurja-super-secret-desk-cookie-key-for-local-dev-min-32";

export function getDeskSecret(): Uint8Array {
  const secret = process.env.DESK_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DESK_COOKIE_SECRET (min 32 chars) must be set in production");
    }
    return new TextEncoder().encode(DEV_FALLBACK);
  }
  return new TextEncoder().encode(secret);
}

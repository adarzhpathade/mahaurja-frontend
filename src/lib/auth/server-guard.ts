import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { canAccessRoute, homeRouteFor } from "./desk-access";
import { getDeskSecret } from "./desk-secret";


export async function verifyServerDeskAccess(currentDeskPrefix: string) {
  const cookieStore = await cookies();
  const deskCookie = cookieStore.get("mh_desk")?.value;
  if (!deskCookie) {
    redirect("/login");
  }

  // redirect() throws NEXT_REDIRECT, so it must not run inside the try/catch below.
  let payload: { role?: string; sub?: string };
  try {
    const verified = await jwtVerify(deskCookie, getDeskSecret(), { algorithms: ["HS256"] });
    payload = verified.payload as { role?: string; sub?: string };
  } catch {
    redirect("/login");
  }
  const role = payload.role ?? "";
  if (!canAccessRoute(role, currentDeskPrefix)) {
    redirect(homeRouteFor(role));
  }
  return payload;
}

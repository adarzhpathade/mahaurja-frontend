"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export function useNavTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const navigateTo = useCallback(
    (url: string) => {
      // If already on target path, no-op
      if (url === pathname) {
        setIsNavigating(false);
        setTargetPath(null);
        return;
      }

      setIsNavigating(true);
      setTargetPath(url);

      startTransition(() => {
        router.push(url);
      });
    },
    [pathname, router]
  );

  // Clear transition once target path matches current path
  useEffect(() => {
    if (targetPath && (pathname === targetPath || pathname.startsWith(targetPath))) {
      setIsNavigating(false);
      setTargetPath(null);
    }
  }, [pathname, targetPath]);

  // Safety timer to prevent stuck loading state
  useEffect(() => {
    if (!isNavigating) return;
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setTargetPath(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isNavigating]);

  return {
    isNavigating: isNavigating || isPending,
    navigateTo,
    pathname,
  };
}

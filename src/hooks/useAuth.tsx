// src/hooks/useAuth.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type UsersRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  access_role: string | null;
  role_id?: string | null;
  name?: string | null;
};

const IS_DEV = import.meta.env.DEV;

function isUuid(v?: string | null) {
  return !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export function useAuth() {
  const [user, setUser] = useState<UsersRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [useProxy, setUseProxy] = useState(true); // Always true for SSO-only

  const userId = useMemo(() => user?.id ?? null, [user?.id]);

  // Fetch user from SSO proxy (/api/me)
  const fetchFromProxy = async (): Promise<UsersRow | null> => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      return isUuid(data?.id)
          ? { id: data.id, email: data.email ?? null, display_name: data.display_name ?? data.name ?? null, access_role: data.access_role ?? null, role_id: data.role_id ?? null }
          : null;
    } catch {
      return null;
    }
  };

  // Hydrate user details from /api/profile
  const hydrateFromProfile = async (seed: UsersRow | null): Promise<UsersRow | null> => {
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (!res.ok) return seed;
      const payload = await res.json();
      const u = payload?.user;
      if (!u || !isUuid(u.id)) return seed;
      return {
        id: u.id,
        email: u.email ?? seed?.email ?? null,
        display_name: u.display_name ?? seed?.display_name ?? null,
        access_role: u.access_role ?? seed?.access_role ?? null,
        role_id: u.role_id ?? seed?.role_id ?? null,
      };
    } catch {
      return seed;
    }
  };

  const fetchMe = async () => {
    setLoading(true);

    // Dev mock for local testing
    if (IS_DEV && String(import.meta.env.VITE_AUTH_MOCK) === "1") {
      const mock: UsersRow = {
        id: import.meta.env.VITE_TEST_USER_ID || "00000000-0000-0000-0000-000000000001",
        email: import.meta.env.VITE_AUTH_MOCK_EMAIL || "leader.local@ibm.com",
        display_name: import.meta.env.VITE_AUTH_MOCK_NAME || "Local Leader",
        access_role: import.meta.env.VITE_AUTH_MOCK_ROLE || "leader",
        role_id: null,
      };
      setUser(mock);
      setLoading(false);
      return;
    }

    // SSO-only: Fetch from proxy
    let me = await fetchFromProxy();
    
    // Hydrate with full profile details
    me = await hydrateFromProfile(me);

    setUser(me);
    setLoading(false);
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const signOut = async () => {
    try {
      // SSO-only: Always use proxy sign out
      await fetch("/oauth2/sign_out", { credentials: "include" }).catch(() => {});
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  };

  return { user, userId, loading, useProxy, refresh: fetchMe, signOut };
}

export default useAuth;

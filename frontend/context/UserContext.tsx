"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

type UserContextValue = {
  user: User | null;
  perfil: { nombre: string | null; rol: string; empresa_id: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  perfil: null,
  loading: true,
  signOut: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [perfil, setPerfil] = useState<UserContextValue["perfil"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) fetchPerfil(supabase, data.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPerfil(supabase, session.user.id);
      else { setPerfil(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchPerfil(supabase: ReturnType<typeof createClient>, userId: string) {
    const { data } = await supabase
      .from("perfiles")
      .select("nombre, rol, empresa_id")
      .eq("id", userId)
      .single();
    setPerfil(data ?? null);
    setLoading(false);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  return (
    <UserContext.Provider value={{ user, perfil, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

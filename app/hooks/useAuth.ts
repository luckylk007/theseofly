import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { supabase } from "../lib/supabase";

async function fetchProfile(userId: string, userEmail: string | undefined) {
  const { setProfile } = useAuthStore.getState();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.warn("Profile fetch error:", error.message);
      setProfile({ id: userId, email: userEmail, role: "editor" });
      return;
    }

    setProfile(data);
  } catch (err) {
    console.error("Unexpected error fetching profile:", err);
    setProfile({ id: userId, email: userEmail, role: "editor" });
  }
}

export function useInitializeAuth() {
  const { initialized, setInitialized, setLoading, setUser, setProfile } =
    useAuthStore();

  useEffect(() => {
    if (initialized) {
      return;
    }

    let isMounted = true;

    const initialize = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser.email);
      } else {
        setProfile(null);
      }

      if (isMounted) {
        setInitialized(true);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setLoading(true);
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser.email);
      } else {
        setProfile(null);
      }

      setInitialized(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [initialized, setInitialized, setLoading, setProfile, setUser]);
}

export function useAuth() {
  const { user, profile, loading, initialized } = useAuthStore();
  return { user, profile, loading, initialized };
}

import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useWebsiteStore } from "../stores/useWebsiteStore";

export function useWebsite() {
  const { user } = useAuthStore();
  const { website, loading, error, fetchWebsite, updateWebsite } = useWebsiteStore();

  useEffect(() => {
    // Only fetch if we have a user and haven't loaded the website yet, 
    // or if the user changed.
    if (user) {
      fetchWebsite(user);
    }
  }, [user, fetchWebsite]);

  return { website, loading, error, fetchWebsite, updateWebsite };
}

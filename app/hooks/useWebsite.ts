import { useWebsiteStore } from "../stores/useWebsiteStore";

export function useWebsite() {
  const { website, loading, error, fetchWebsite, updateWebsite } = useWebsiteStore();

  return { website, loading, error, fetchWebsite, updateWebsite };
}

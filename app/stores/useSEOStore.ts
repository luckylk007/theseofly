import { create } from 'zustand';

interface SEOStore {
  interpolate: (pattern: string, variables: Record<string, string>) => string;
}

export const useSEOStore = create<SEOStore>((_set) => ({
  interpolate: (pattern, variables) => {
    if (!pattern || typeof pattern !== 'string') return pattern;
    return pattern.replace(/{(\w+)}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  },
}));

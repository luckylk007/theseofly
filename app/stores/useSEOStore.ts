import { create } from 'zustand';

interface SEOTemplate {
  id: string;
  name: string;
  templateString: string;
  variables: string[];
}

interface SEOStore {
  templates: SEOTemplate[];
  interpolate: (template: string, variables: Record<string, string>) => string;
}

export const useSEOStore = create<SEOStore>((_set) => ({
  templates: [],
  interpolate: (template, variables) => {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return variables[key] || match;
    });
  },
}));

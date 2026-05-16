import { create } from 'zustand';

interface PageBlock {
  id: string;
  type: 'hero' | 'features' | 'faq' | 'cta' | 'testimonials';
  content: any;
}

interface PageBuilderState {
  blocks: PageBlock[];
  addBlock: (type: PageBlock['type']) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, content: any) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
}

export const usePageBuilderStore = create<PageBuilderState>((set) => ({
  blocks: [],
  addBlock: (type) => set((state) => ({
    blocks: [...state.blocks, { id: Math.random().toString(36).substr(2, 9), type, content: getDefaultContent(type) }]
  })),
  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter((b) => b.id !== id)
  })),
  updateBlock: (id, content) => set((state) => ({
    blocks: state.blocks.map((b) => b.id === id ? { ...b, content } : b)
  })),
  moveBlock: (id, direction) => set((state) => {
    const index = state.blocks.findIndex((b) => b.id === id);
    if (index === -1) return state;
    const newBlocks = [...state.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return state;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    return { blocks: newBlocks };
  }),
}));

function getDefaultContent(type: PageBlock['type']) {
  switch (type) {
    case 'hero': return { title: "Hero Title", subtitle: "Hero Subtitle", cta: "Get Started" };
    case 'faq': return { items: [{ question: "Question 1", answer: "Answer 1" }] };
    default: return {};
  }
}

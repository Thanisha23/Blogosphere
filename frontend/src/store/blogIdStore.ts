import {create} from "zustand"

interface BlogIdState {
    deletedIds: string[];
    addDeletedId: (id: string) => void;
    clearDeletedIds: () => void;
}

export const blogIdStore = create<BlogIdState>((set) => ({
    deletedIds: [],
    addDeletedId: (id) => set((state) => ({ deletedIds: [...state.deletedIds, id] })),
    clearDeletedIds: () => set({ deletedIds: [] }),
}));
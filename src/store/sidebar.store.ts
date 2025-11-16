import { create } from 'zustand';

type SidebarState = {
  setCollapsed: (isCollapsed: boolean) => void;
  collapsed: boolean;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  setCollapsed: (isCollapsed) => set({ collapsed: isCollapsed }),
  collapsed: true,
}));

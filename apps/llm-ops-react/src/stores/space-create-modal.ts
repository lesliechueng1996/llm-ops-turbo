import { create } from 'zustand';

type SpaceCreateModalStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
};

const useSpaceCreateModal = create<SpaceCreateModalStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));

export default useSpaceCreateModal;

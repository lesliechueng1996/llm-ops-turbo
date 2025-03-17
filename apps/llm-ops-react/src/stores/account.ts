import { create } from 'zustand';

type AccountStore = {
  name: string;
  email: string;
  avatar: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setAvatar: (avatar: string) => void;
  setAccount: (data: { name: string; email: string; avatar: string }) => void;
};

const useAccountStore = create<AccountStore>((set) => ({
  name: '',
  email: '',
  avatar: '',
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setAvatar: (avatar) => set({ avatar }),
  setAccount: (data) => set(data),
}));

export default useAccountStore;

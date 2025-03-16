import { create } from 'zustand';

type CredentialStore = {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  isAuthenticated: () => boolean;
  clear: () => void;
  setCredential: (accessToken: string, refreshToken: string) => void;
};

const useCredentialStore = create<CredentialStore>((set, get) => ({
  accessToken: localStorage.getItem('accessToken') ?? null,
  refreshToken: localStorage.getItem('refreshToken') ?? null,
  setAccessToken: (accessToken) => {
    if (accessToken !== null) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
    set({ accessToken });
  },
  setRefreshToken: (refreshToken) => {
    if (refreshToken !== null) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
    set({ refreshToken });
  },
  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ accessToken: null, refreshToken: null });
  },
  isAuthenticated: () => {
    return get().accessToken !== null;
  },
  setCredential: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken });
  },
}));

export default useCredentialStore;

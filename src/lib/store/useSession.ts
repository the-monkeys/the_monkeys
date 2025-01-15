import { IUser } from '@/services/models/user';
import { createStore } from 'zustand';

export type SessionState =
  | {
      status: 'unauthenticated';
      data: null;
    }
  | {
      status: 'authenticated';
      data: {
        user: Partial<IUser>;
      };
    }
  | {
      status: 'loading';
      data: {
        user: IUser;
      } | null;
    };

type SessionAction = {
  update: (state: Partial<SessionState>) => void;
};

type SessionStore = SessionState & SessionAction;

export const createSessionStore = (
  initState: SessionState = { status: 'unauthenticated', data: null }
) => {
  return createStore<SessionStore>()((set) => ({
    ...initState,
    update: (state) => set(state),
  }));
};

export type SessionStoreApi = ReturnType<typeof createSessionStore>;

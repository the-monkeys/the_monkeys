import { createStore } from 'zustand';

import { User } from '../types';

export type SessionState =
  | {
      status: 'unauthenticated';
      data: null;
    }
  | {
      status: 'authenticated';
      data: {
        user: User;
      };
    }
  | {
      status: 'loading';
      data: {
        user: User;
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

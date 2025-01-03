'use client';

import { createContext, useContext, useRef } from 'react';

import { createStore, useStore } from 'zustand';

import { User } from '../types';

type SessionState =
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

const createSessionStore = (
  initState: SessionState = { status: 'unauthenticated', data: null }
) => {
  return createStore<SessionStore>()((set) => ({
    ...initState,
    update: (state) => set(state),
  }));
};

type SessionStoreApi = ReturnType<typeof createSessionStore>;

const SessionStoreContext = createContext<SessionStoreApi | undefined>(
  undefined
);

export const SessionStoreProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: User | null;
}) => {
  const storeRef = useRef<SessionStoreApi>();
  if (!storeRef.current) {
    let initialState: SessionState | undefined;
    if (value) {
      initialState = { status: 'authenticated', data: { user: value } };
    }

    storeRef.current = createSessionStore(initialState);
  }

  return (
    <SessionStoreContext.Provider value={storeRef.current}>
      {children}
    </SessionStoreContext.Provider>
  );
};

export const useSession = () => {
  const sessionStoreContext = useContext(SessionStoreContext);

  if (!sessionStoreContext) {
    throw new Error(`useSessionStore must be used within SessionStoreProvider`);
  }

  return useStore(sessionStoreContext, (state) => state);
};

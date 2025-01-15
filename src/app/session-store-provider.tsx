'use client';

import { createContext, useContext, useRef } from 'react';

import {
  SessionState,
  SessionStoreApi,
  createSessionStore,
} from '@/lib/store/useSession';
import { UserJWT } from '@/services/models/user';
import { useStore } from 'zustand';

const SessionStoreContext = createContext<SessionStoreApi | undefined>(
  undefined
);

export const SessionStoreProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: UserJWT | null;
}) => {
  const storeRef = useRef<SessionStoreApi>();
  if (!storeRef.current) {
    let initialState: SessionState | undefined;
    if (value) {
      initialState = {
        status: 'authenticated',
        data: {
          user: {
            ...value,
          },
        },
      };
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

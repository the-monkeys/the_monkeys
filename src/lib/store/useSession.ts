import { create } from 'zustand';

import { User } from '../types';

interface UnauthenticatedSession {
  status: 'unauthenticated';
  data: {
    user: null;
  };
}

interface AuthenticatedSession {
  status: 'authenticated';
  data: {
    user: User;
  };
}

type Session = AuthenticatedSession | UnauthenticatedSession;

interface SessionMethods {
  setSession: (state: Session) => void;
}

export const useSession = create<Session & SessionMethods>((set) => ({
  status: 'unauthenticated',
  data: {
    user: null,
  },
  setSession: (nextState: Session) => set(nextState),
}));

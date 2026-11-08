import { useSyncExternalStore } from 'react';
import { getSession, subscribe } from '../auth/session';

// Returns the current session and rerenders on change
export const useSession = () => useSyncExternalStore(subscribe, getSession);

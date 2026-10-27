import { useSyncExternalStore } from 'react';
import { getSession, subscribe } from '../auth/session';

export const useSession = () => useSyncExternalStore(subscribe, getSession);

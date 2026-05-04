// Context per l'autenticazione globale di LipariBank.
// Pattern professionale: context + custom hook + provider separati.
// Questo file esporta SOLO il custom hook useAuth — il context grezzo
// non è accessibile dall'esterno per prevenire usi impropri.

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';

// Tipizzazione dell'utente autenticato
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'advisor' | 'admin';
  accountIds: string[];
}

// Il "contratto" del context: cosa espone ai consumatori
interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: AuthUser['role']) => boolean;
}

// Il context NON è esportato: si accede SOLO tramite useAuth.
// Questo previene che qualcuno faccia useContext(AuthContext) direttamente
// senza la validazione che facciamo dentro useAuth.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Props del Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Il Provider: gestisce lo stato e fornisce le funzioni.
// È l'unico posto dove lo stato auth viene modificato.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useCallback per stabilizzare le funzioni: il value del context
  // le include, e senza useCallback ogni render creerebbe nuove reference
  // causando re-render di TUTTI i consumer (problema n.1 del Context).
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulazione chiamata API di login — al Giorno 5 sarà una vera fetch
      // con JWT. Al Giorno 9 aggiungeremo refresh token e interceptors.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock dell'utente autenticato
      const mockUser: AuthUser = {
        id: 'usr_001',
        name: 'Mario Rossi',
        email,
        role: email.includes('admin') ? 'admin' : 'customer',
        accountIds: ['acc_001', 'acc_002'],
      };
      setUser(mockUser);
    } catch (error) {
      // Al Giorno 9 gestiremo errori JWT e refresh qui
      throw new Error('Credenziali non valide');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback((): void => {
    setUser(null);
    // Al Giorno 9: invalidiamo il JWT, puliamo cookies/storage
    // Al Giorno 8: faremo dispatch di un'azione Redux per pulire tutto lo store
  }, []);

  // hasRole: utility function per il role-based access control (RBAC)
  // Usata da ProtectedRoute al Giorno 6
  const hasRole = useCallback(
    (role: AuthUser['role']): boolean => user?.role === role,
    [user?.role]
  );

  // CRUCIALE: il value del context è memoizzato con useMemo.
  // Senza useMemo, il value sarebbe un NUOVO oggetto ad ogni render di AuthProvider,
  // causando il re-render di TUTTI i componenti che usano useAuth —
  // anche quelli che usano solo `isAuthenticated` (che non è cambiato).
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
      hasRole,
    }),
    [user, isLoading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook: l'unico modo per consumare AuthContext.
// Valida che venga usato dentro un AuthProvider (errore chiaro in sviluppo).
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Questo errore appare in sviluppo se useAuth viene chiamato fuori dal Provider.
    // In produzione è un errore di programmazione, non di runtime.
    throw new Error('useAuth deve essere usato dentro un <AuthProvider>');
  }
  return context;
};
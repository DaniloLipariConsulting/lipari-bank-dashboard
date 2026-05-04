// src/core/api/useApi.ts
// Custom hook generico per chiamate HTTP GET.
// Pattern professionale: astrae fetch, loading, error, abort.
// Tipizzato con generics TypeScript per type-safety della response.

import { useState, useEffect, useCallback, useRef } from 'react';

// Tipi per lo stato del hook
interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

// Struttura di errore normalizzata: indipendentemente dal formato
// dell'errore del backend (può variare tra microservizi),
// restituiamo sempre un formato consistente all'UI.
interface ApiError {
  message: string;
  statusCode: number | null;
  timestamp: Date;
}

// Opzioni del hook: permette personalizzazione senza riscrivere il hook
interface UseApiOptions {
  headers?: Record<string, string>;
  // Se true, la chiamata parte immediatamente al mount.
  // Se false, va chiamata manualmente (es: form submit).
  immediate?: boolean;
}

// Il hook generico con TypeScript generics.
// T è il tipo della response: useApi<Account[]>(...) tipa data come Account[] | null
const useApi = <T>(
  url: string,
  options: UseApiOptions = { immediate: true }
) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: options.immediate ?? true, // Se parte subito, loading = true dall'inizio
    error: null,
  });

  // useRef per il AbortController: non deve triggerare re-render quando cambia
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    // Annulla eventuale richiesta precedente prima di avviarne una nuova
    // Questo gestisce il caso di re-fetch rapido (es: cambio filtri)
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          // Al Giorno 9 aggiungeremo qui l'Authorization: Bearer {token}
          ...options.headers,
        },
      });

      // fetch non lancia eccezione per 4xx/5xx: dobbiamo controllare response.ok
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Errore sconosciuto' }));
        throw {
          message: errorBody.message || `Errore HTTP ${response.status}`,
          statusCode: response.status,
        };
      }

      const data: T = await response.json();

      // Se la richiesta è stata abortita (componente smontato o nuova richiesta),
      // non aggiorniamo lo state: il componente potrebbe non esistere più.
      if (!abortControllerRef.current.signal.aborted) {
        setState({ data, isLoading: false, error: null });
      }
    } catch (err: unknown) {
      // Non trattiamo l'AbortError come un vero errore: è un'operazione intenzionale
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const apiError: ApiError = {
        message: (err as ApiError).message || 'Errore di connessione al server bancario',
        statusCode: (err as ApiError).statusCode || null,
        timestamp: new Date(),
      };

      if (!abortControllerRef.current.signal.aborted) {
        setState({ data: null, isLoading: false, error: apiError });
      }
    }
  }, [url, options.headers]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }

    // Cleanup: annulla la richiesta se il componente si smonta
    // o se url/headers cambiano (nuova richiesta in partenza)
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData, options.immediate]);

  // Restituiamo anche refetch per permettere il refresh manuale
  return { ...state, refetch: fetchData };
};

export default useApi;
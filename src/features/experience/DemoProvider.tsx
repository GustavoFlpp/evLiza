'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createInitialState } from './engine';
import { loadDemo, saveDemo, resetDemo } from '@/services/demoStorage';
import type { DemoState } from '@/types';
type DemoContext = {
  state: DemoState;
  ready: boolean;
  error: string;
  notice: string;
  run: (change: (state: DemoState) => DemoState) => boolean;
  reset: () => void;
  clearError: () => void;
};
const Context = createContext<DemoContext | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(createInitialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const current = useRef(state);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const loaded = loadDemo(localStorage);
        current.current = loaded.state;
        setState(loaded.state);
        if (loaded.recovered)
          setNotice('Dados incompatíveis restaurados. Comece uma nova experiência.');
      } catch {
        setNotice('Persistência indisponível. A demonstração funciona nesta sessão.');
      }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  function run(change: (state: DemoState) => DemoState) {
    if (!ready) {
      setError('Preparando a demonstração. Tente novamente.');
      return false;
    }
    try {
      const next = change(current.current);
      current.current = next;
      setState(next);
      setError('');
      try {
        saveDemo(localStorage, next);
      } catch {
        setNotice('Alteração salva apenas nesta sessão.');
      }
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível concluir.');
      return false;
    }
  }
  function reset() {
    try {
      resetDemo(localStorage);
    } catch {
      setNotice('Storage bloqueado; estado restaurado nesta sessão.');
    }
    current.current = createInitialState();
    setState(current.current);
    setError('');
  }
  return (
    <Context.Provider
      value={{ state, ready, error, notice, run, reset, clearError: () => setError('') }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error('Provider ausente');
  return value;
}

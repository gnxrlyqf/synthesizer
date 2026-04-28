import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Cable } from "./Scene/Scene";

export type ConnectionMode = "idle" | "selecting-source" | "selecting-target";

interface ConnectionState {
  source: string | null;
  target: string | null;
  id: string | null;
  mode: ConnectionMode;
  selectSource: (id: string, param: string) => void;
  selectTarget: (id: string, param: string) => void;
  reset: () => void;
}

const ConnectionContext = createContext<ConnectionState | undefined>(undefined);

export const ConnectionProvider = (props: { children: React.ReactNode; setCables: React.Dispatch<React.SetStateAction<Cable[]>> }) => {
  const [source, setSource] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [mode, setMode] = useState<ConnectionMode>("idle");

  const selectSource = (id: string, param: string) => {
    setId(id);
    setSource(`${id}.${param}`);
    setMode("selecting-source");
  };

  const selectTarget = (id: string, param: string) => {
    setId(id);
    setTarget(`${id}.${param}`);
    setMode("selecting-target");
  };

  const reset = () => {
    setId(null);
    setSource(null);
    setTarget(null);
    setMode("idle");
  };


  useEffect(() => {
    if (source && target) {
      props.setCables((prev) => [...prev, {id: uuidv4(), from: source, to: target}]);
      reset();
    }
  }, [source, target]);

  return (
    <ConnectionContext.Provider value={{ source, target, id, mode, selectSource, selectTarget, reset }}>
      {props.children}
    </ConnectionContext.Provider>
  );
};

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error("useConnection must be used within ConnectionProvider");
  return ctx;
}

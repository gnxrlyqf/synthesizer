import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Cable } from "./Scene/Scene";

export type ParamId = string | null;
export type ConnectionMode = "idle" | "selecting-source" | "selecting-target";

interface ConnectionState {
  source: ParamId;
  target: ParamId;
  mode: ConnectionMode;
  selectSource: (paramId: string) => void;
  selectTarget: (paramId: string) => void;
  reset: () => void;
}

const ConnectionContext = createContext<ConnectionState | undefined>(undefined);

export const ConnectionProvider = (props: { children: React.ReactNode; setCables: React.Dispatch<React.SetStateAction<Cable[]>> }) => {
  const [source, setSource] = useState<ParamId>(null);
  const [target, setTarget] = useState<ParamId>(null);
  const [mode, setMode] = useState<ConnectionMode>("idle");

  const selectSource = (paramId: string) => {
    setSource(paramId);
    setMode("selecting-target");
  };

  const selectTarget = (paramId: string) => {
    setTarget(paramId);
    setMode("selecting-source");
  };

  const reset = () => {
    setSource(null);
    setTarget(null);
    setMode("idle");
  };

  if (source && target) {
    props.setCables((prev) => [...prev, {id: uuidv4(), from: source, to: target}]);
	reset();
  }

  return (
    <ConnectionContext.Provider value={{ source, target, mode, selectSource, selectTarget, reset }}>
      {props.children}
    </ConnectionContext.Provider>
  );
};

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error("useConnection must be used within ConnectionProvider");
  return ctx;
}

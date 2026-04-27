import React, { createContext, useContext, useState } from "react";

const ParamsDisabledContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

const ParamsDisabledProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useState(false);
  return (
    <ParamsDisabledContext.Provider value={state}>
      {children}
    </ParamsDisabledContext.Provider>
  );
};

function useParamsDisabled() {
  const ctx = useContext(ParamsDisabledContext);
  if (!ctx) throw new Error("useParamsDisabled must be used within ParamsDisabledProvider");
  return ctx;
}

function handleParamSelect() {
  const [paramsDisabled, setParamsDisabled] = useParamsDisabled();

  setParamsDisabled(true);
}

export {ParamsDisabledProvider, useParamsDisabled}
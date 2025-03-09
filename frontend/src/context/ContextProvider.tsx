'use client'
import React, { useContext, useState } from "react";

interface IAppContext {
  appState: {
    content: string;
  };
  setAppState: React.Dispatch<React.SetStateAction<IAppContext["appState"]>>;
}

const AppContext = React.createContext<IAppContext | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);

    return context;
}

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<IAppContext["appState"]>({
    content: "",
  });

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;

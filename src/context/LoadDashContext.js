/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createContext, useState, useContext } from 'react';


const ControllerLoaderContext = createContext();

export const LoaderContext = ({ children }) => {
  const [loaderDash, setLoaderDash] = useState(false);

  return (
    <ControllerLoaderContext.Provider value={{ loaderDash, setLoaderDash }}>
      {children}
    </ControllerLoaderContext.Provider>
  );
};

export function useLoaderDashboard() {
  const context = useContext(ControllerLoaderContext);

  return context;
}

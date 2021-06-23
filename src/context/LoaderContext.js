import React, {useContext, createContext, useState} from 'react';
import { LoaderSimple } from '../components/Main/Loader/index.js';


const LoaderContext = createContext();

export const useLoaderScreen = () => {
  return useContext(LoaderContext);
};

const LoaderProvider = ({ children }) => {
  const [load, setLoad] = useState('transparent');

  return (
    <LoaderContext.Provider value={{ setLoad, load }}>
      {load && <LoaderSimple load={load} />}
      {children}
    </LoaderContext.Provider>
  );
};
export default LoaderProvider;

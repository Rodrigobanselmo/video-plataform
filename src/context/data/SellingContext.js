import React, {useContext, createContext, useState} from 'react';

export const SellingContext = createContext();
export const CursosContext = createContext();

export const useSellingData = () => {
  return useContext(SellingContext);
};

export const useCursosData = () => {
  return useContext(CursosContext);
};

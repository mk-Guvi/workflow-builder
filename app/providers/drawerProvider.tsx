/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface DrawerProviderProps {
  children: React.ReactNode;
}

export type DrawerData = Record<string,any>

type DrawerContextType = {
  data: DrawerData;
  isOpen: boolean;
  setOpen: (Drawer: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

export const DrawerContext = createContext<DrawerContextType>({
  data: {},
  isOpen: false,
  setOpen: (Drawer: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<DrawerData>({});
  const [showingDrawer, setShowingDrawer] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    Drawer: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (Drawer) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {});
      }
      setShowingDrawer(Drawer);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) return null;

  return (
    <DrawerContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingDrawer}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within the Drawer provider");
  }
  return context;
};

export default DrawerProvider;

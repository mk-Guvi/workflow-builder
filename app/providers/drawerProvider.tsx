/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface DrawerProviderProps {
  children: React.ReactNode;
}

export type DrawerData = Record<string, any>;

type DrawerContextType = {
  data: DrawerData;
  isOpen: boolean;
  setOpen: (Drawer: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
  setFullScreen: (value: boolean) => void;
  isFullScreen: boolean;
  isDisabled: boolean;
  setIsDisabled: (value: boolean) => void;
};

export const DrawerContext = createContext<DrawerContextType>({
  data: {},
  isOpen: false,
  setOpen: (Drawer: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
  isFullScreen: false,
  setFullScreen: () => {},
  isDisabled: false,
  setIsDisabled: () => {},
});

const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<DrawerData>({});
  const [showingDrawer, setShowingDrawer] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    Drawer: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (Drawer) {
      if (fetchData) {
        const fetchedData = await fetchData();
        setData({ ...data, ...(fetchedData || {}) });
      }
      setShowingDrawer(Drawer);
      setIsOpen(true);
    }
  };

  const setFullScreen = (value: boolean) => {
    setIsFullScreen(value);
  };

  const setClose = () => {
    if (!isDisabled) {
      setIsOpen(false);
      setData({});
      setIsFullScreen(false);
    }
  };

  if (!isMounted) return null;

  return (
    <DrawerContext.Provider
      value={{
        data,
        isFullScreen,
        setFullScreen,
        setOpen,
        setClose,
        isOpen,
        isDisabled,
        setIsDisabled,
      }}
    >
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

"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PageInfo {
  title: string;
  description: string;
}

interface PageContextType {
  pageInfo: PageInfo;
  setPageInfo: (info: PageInfo) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    title: "กำลังโหลด...",
    description: "",
  });

  return (
    <PageContext.Provider value={{ pageInfo, setPageInfo }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
};
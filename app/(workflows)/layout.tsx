import React from "react";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <div className="border-l-[1px] p-4 border-t-[1px] pb-20 h-screen w-full rounded-l-3xl border-muted-foreground/20 overflow-auto">
      {children}
    </div>
  );
};

export default Layout;

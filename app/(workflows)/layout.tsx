import React from "react";
import WorkflowListingHeader from "./components/headers/workflowListingHeader";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <>
      <WorkflowListingHeader />
      
        {children}
      
    </>
  );
};

export default Layout;

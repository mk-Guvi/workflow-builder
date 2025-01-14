import GlobalLayout from "@/components/globals/GlobalLayout";
import React from "react";

function ErrorPage() {
  return (
    <GlobalLayout>
      <div className="h-full w-full place-content-center font-semibold text-lg flex items-center justify-center">
        Page Not Found (or) Page Under Construction
      </div>
    </GlobalLayout>
  );
}

export default ErrorPage;

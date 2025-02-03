"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const ErrorView = ({ error }: { error: string }) => {
    const router = useRouter();
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">Error: {error}</p>
  
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  };
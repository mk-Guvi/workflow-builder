"use client";
import React, { useState } from "react";

import { useModal } from "@/app/providers/modalProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type Props = {
  title: string;
  onConfirm: () => Promise<void>;
  children: string | React.ReactNode;
  defaultOpen?: boolean;
};

const GlobalModal = ({ children, title, defaultOpen, onConfirm }: Props) => {
  const { isOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };
  return (
    <Dialog open={isOpen} modal defaultOpen={defaultOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mt-2">{children}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={setClose} disabled={loading} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalModal;

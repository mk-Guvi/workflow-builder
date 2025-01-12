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
  subTitle?: string;
  onConfirm?: () => Promise<void>;
  children: string | React.ReactNode;
  defaultOpen?: boolean;
};

const GlobalModal = ({
  children,
  title,
  subTitle,
  defaultOpen,
  onConfirm,
}: Props) => {
  const { isOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if(!onConfirm)return
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };
 
  return (
    <Dialog open={isOpen} modal defaultOpen={defaultOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mt-2">{subTitle}</DialogDescription>
        </DialogHeader>
        {children}
        {onConfirm ? (
          <DialogFooter className="gap-2">
            <Button onClick={setClose} disabled={loading} variant={"outline"}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              Confirm
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalModal;

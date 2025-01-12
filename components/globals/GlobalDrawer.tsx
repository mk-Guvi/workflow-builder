"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Drawer as VaulDrawer } from "vaul";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useDrawer } from "@/app/providers/drawerProvider";
type Props = {
  title: string;
  subheading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  position?: "right" | "left";
  modal?:boolean
};
export default function DrawerComponent({
  children,
  defaultOpen,
  title,
  subheading,
  position = "right",
  modal=true
}: Props) {
  const { isOpen, setClose } = useDrawer();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleClose = () => setClose();

  if (isDesktop) {
    return (
      <VaulDrawer.Root
        direction={position}
        modal={modal}
        dismissible={false}
        defaultOpen={defaultOpen}
        open={isOpen}
      >
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
          <VaulDrawer.Content
            className="right-2 top-2 bottom-2 fixed z-[999] outline-none w-[310px] flex"
            // The gap between the edge of the screen and the drawer is 8px in this case.
            style={
              {
                "--initial-transform": "calc(100% + 18px)",
              } as React.CSSProperties
            }
          >
            <div className="bg-zinc-50 h-full w-full grow p-5 flex overflow-auto flex-col rounded-[16px]">
              <VaulDrawer.Title className="font-medium mb-2 text-zinc-900">
                {title}
              </VaulDrawer.Title>
              <VaulDrawer.Description className="text-zinc-600 mb-2">
                {subheading}
              </VaulDrawer.Description>
              <div className="flex-1 overflow-auto w-full h-full">{children}</div>
            </div>
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    );
  }

  return (
    <Drawer open={isOpen} onClose={handleClose} defaultOpen={defaultOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{subheading}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

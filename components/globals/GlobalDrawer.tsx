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
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import clsx from "clsx";

type Props = {
  title?: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  modal?: boolean;
  hideHeader?: boolean;
};

export default function DrawerComponent({
  children,
  defaultOpen,
  title,
  subheading,
  hideHeader = false,
  modal = false,
}: Props) {
  const { isOpen, setClose, isFullScreen } = useDrawer();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const handleClose = () => setClose();

  useEffect(() => {
    if (isOpen) {
      handleClose();
    }
  }, [pathname]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      document.body.style.pointerEvents = "auto"
    });
  }, [isOpen]);

  if (isDesktop) {
    return (
      <VaulDrawer.Root
        direction={"right"}
        modal={modal}
        dismissible={false}
        defaultOpen={defaultOpen}
        open={isOpen}
      >
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
          <VaulDrawer.Content
            className={clsx(
              "fixed z-[999] outline-none flex transition-all duration-300",
              isFullScreen ? "inset-2" : `right-2 top-2 bottom-2 w-[310px]`
            )}
            style={
              !isFullScreen
                ? ({
                    "--initial-transform": "calc(100% + 18px)",
                  } as React.CSSProperties)
                : undefined
            }
          >
            <div className="bg-zinc-50 h-full w-full grow p-5 flex overflow-auto flex-col rounded-[16px]">
              <VaulDrawer.Title
                hidden={hideHeader}
                className="font-medium text-zinc-900"
              >
                {title}
              </VaulDrawer.Title>

              <VaulDrawer.Description
                hidden={hideHeader}
                className="text-zinc-600"
              >
                {subheading}
              </VaulDrawer.Description>

              <div
                className={clsx(
                  "flex-1 overflow-auto w-full h-full",
                  !hideHeader && (title || subheading) ? "" : "-mt-2"
                )}
              >
                {children}
              </div>
            </div>
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    );
  }

  return (
    <Drawer open={isOpen} onClose={handleClose} defaultOpen={defaultOpen}>
      <DrawerContent className={clsx(isFullScreen && "h-[95vh]")}>
        {!hideHeader && (title || subheading) && (
          <DrawerHeader className="text-left">
            <div className="flex justify-between items-center">
              <div>
                {title && <DrawerTitle>{title}</DrawerTitle>}
                {subheading && (
                  <DrawerDescription>{subheading}</DrawerDescription>
                )}
              </div>
            </div>
          </DrawerHeader>
        )}
        <div
          className={clsx(!hideHeader && (title || subheading) ? "" : "mt-4")}
        >
          {children}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

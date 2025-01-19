import { ExpandIcon, Minimize } from "lucide-react";
import React from "react";

type Props = {
  title: string;
  children?: React.ReactNode;
  isFullScreen?: boolean;
  onChangeFullScreen?: () => void;
};

function Header({ title, children, isFullScreen, onChangeFullScreen }: Props) {
  return (
    <header className="flex p-4 items-center gap-2">
      <p className="flex-1 font-medium text-gray-600">{title}</p>
      {children}
      {onChangeFullScreen ? (
        !isFullScreen ? (
          <ExpandIcon size={14} onClick={onChangeFullScreen} />
        ) : (
          <Minimize size={16} onClick={onChangeFullScreen} />
        )
      ) : null}
    </header>
  );
}

export default Header;

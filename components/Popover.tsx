import React, { useState } from "react";

type PopoverComponentProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  trigger?: "hover" | "focus" | "click";
  visible?: boolean;
};

const Popover = ({ children, content }: PopoverComponentProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <div className="absolute">{content}</div>
      <div>{children}</div>
    </div>
  );
};

export default Popover;

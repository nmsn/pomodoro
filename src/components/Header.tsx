import { ArrowRight } from "./Icon";
import { useState,useEffect } from "react";

const Header = ({
  open,
  onChange,
}: {
  open: boolean;
  onChange: (open: boolean) => void;
}) => {
  const [curOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const onCurChange = (open: boolean) => {
    setOpen(open);
    onChange?.(open);
  };

  return (
    <div className="absolute top-0 w-full h-12 flex items-center px-4 space-x-4">
      <ArrowRight open={curOpen} onClick={() => onCurChange(!curOpen)} />
    </div>
  );
};

export default Header;

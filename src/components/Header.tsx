import { useEffect, useState } from 'react';
import Image from 'next/image';

import { isMobile } from '@/utils';

import { Arrow } from './Icon';

const Header = ({ open, onChange }: { open: boolean; onChange: (open: boolean) => void }) => {
  const [curOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const onCurChange = (open: boolean) => {
    setOpen(open);
    onChange?.(open);
  };

  return (
    <div className="absolute top-0 w-screen h-12 flex justify-between items-center px-4 space-x-4 z-10">
      <Arrow
        open={curOpen}
        onClick={() => onCurChange(!curOpen)}
        direction={isMobile() ? 'vertical' : 'horizontal'}
      />
      <a className="cursor-pointer" href="https://github.com/nmsn/pomodoro">
        <Image src="/github.svg" alt="logo" width={24} height={24} />
      </a>
    </div>
  );
};

export default Header;

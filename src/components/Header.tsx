import { useEffect, useState } from 'react';

import isMobile from '@/utils/isMobile';

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
    <div className="absolute top-0 w-full h-12 flex items-center px-4 space-x-4">
      <Arrow
        open={curOpen}
        onClick={() => onCurChange(!curOpen)}
        direction={isMobile() ? 'vertical' : 'horizontal'}
      />
    </div>
  );
};

export default Header;

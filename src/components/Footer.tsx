import { useEffect, useState } from 'react';

import { FullScreen } from './Icon';

/**
 * TODO
 * Change color theme and loop button
 */
const Footer = () => {
  const [canFullScreen, setCanFullScreen] = useState(false);
  useEffect(() => {
    document.fullscreenEnabled && setCanFullScreen(true);
  }, []);
  return (
    <div className="absolute bottom-0 w-screen h-12 flex justify-end items-center px-4 space-x-4 z-10">
      {/* <BeakerIcon /> */}
      {canFullScreen && <FullScreen />}
    </div>
  );
};

export default Footer;

import { useState, useEffect } from "react";
import { BeakerIcon, FullScreen } from "./Icon";

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
    <div className="absolute bottom-0 w-screen h-12 flex justify-end items-center px-4 space-x-4">
      
      <BeakerIcon />
      {canFullScreen && <FullScreen />}
    </div>
  );
};

export default Footer;

import { BeakerIcon, SwitchLoopIcon } from "./Icon";

/**
 * TODO
 * Change color theme and loop button
 */
const Footer = ({
  onChangeSwitchLoopIcon,
}: {
  onChangeSwitchLoopIcon: (on: boolean) => void;
}) => {
  return (
    <div className="absolute bottom-0 w-screen h-12 flex justify-end items-center px-4 space-x-4">
      <BeakerIcon />
      <SwitchLoopIcon onChange={onChangeSwitchLoopIcon} />
    </div>
  );
};

export default Footer;

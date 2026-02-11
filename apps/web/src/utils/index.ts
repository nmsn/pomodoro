export const isMobile = () => {
  return (
    isBrowser() &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
};

export const isPhone = () => isMobile() && window?.innerWidth < 768;
export const isTablet = () => isMobile() && window?.innerWidth >= 768 && window?.innerWidth < 1024;

export const isBrowser = () => {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
};

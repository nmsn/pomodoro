export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIpad = () => {
  return /iPad/i.test(navigator.userAgent);
};

export const browserHeaderHeight = () => {
  const innerH = window.innerHeight; //W3C-不包括菜单栏、工具栏以及滚动条等的浏览器窗口高度
  const outH = window.outerHeight; //整个浏览器窗口的高度

  return outH - innerH;
};

export const isBrowser = () => {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
};

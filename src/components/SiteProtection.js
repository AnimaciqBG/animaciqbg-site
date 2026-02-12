import { useEffect, memo } from 'react';

const SiteProtection = memo(() => {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && !e.shiftKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'k' || e.keyCode === 75)) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm' || e.keyCode === 77)) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO' || e.target.tagName === 'IFRAME') {
        e.preventDefault();
        return false;
      }
    };

    const handleCopy = (e) => {
      const tag = e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    };

    let devtoolsCheckInterval;
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        document.title = 'AnimaciqBG - DevTools Detected';
      } else {
        document.title = 'AnimaciqBG';
      }
    };

    const consoleWarn = () => {
      console.clear();
      console.log('%cСТОП!', 'color:red;font-size:60px;font-weight:900;text-shadow:2px 2px black');
      console.log('%cТова е функция за разработчици.', 'color:white;font-size:18px');
      console.log('%cАко някой ви е казал да копирате нещо тук, това е измама.', 'color:orange;font-size:16px');
    };
    consoleWarn();
    const consoleInterval = setInterval(consoleWarn, 5000);

    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('copy', handleCopy, true);

    devtoolsCheckInterval = setInterval(checkDevTools, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('copy', handleCopy, true);
      clearInterval(devtoolsCheckInterval);
      clearInterval(consoleInterval);
    };
  }, []);

  return null;
});

export default SiteProtection;

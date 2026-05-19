import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Reset scroll on every route change so collection links open at the top. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

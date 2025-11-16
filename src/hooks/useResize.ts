import { useLayoutEffect, useState, useMemo } from 'react';

const useResize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const getSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    getSize();
    window.addEventListener('resize', getSize);
    return () => window.removeEventListener('resize', getSize);
  }, []);

  const isMobile = useMemo(() => size.width <= 500, [size.width]);
  const isTablet = useMemo(() => 500 < size.width && size.width <= 720, [size.width]);

  return { ...size, isMobile, isTablet };
};

export default useResize;

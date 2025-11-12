// simple hook to detect mobile by breakpoint
import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);

  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setIsMobile(window.innerWidth <= breakpoint), 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [breakpoint]);

  return isMobile;
}

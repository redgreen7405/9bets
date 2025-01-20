import { useState, useEffect } from "react";

export default function useMediaQuery(width) {
  const [isScreenSmall, setIsScreenSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth <= width);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return isScreenSmall;
}

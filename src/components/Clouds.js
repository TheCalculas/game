import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Clouds.css";

const Clouds = () => {
  const [isReady, setIsReady] = useState(false);
  const isPaused = useSelector((state) => state.engine.pause);

  // Check if document is loaded before animating clouds
  useEffect(() => {
    const setLoad = () => setIsReady(true);

    if (document.readyState === "complete") {
      setLoad();
    } else {
      window.addEventListener("load", setLoad);

      // return cleanup function
      return () => window.removeEventListener("load", setLoad);
    }
  }, []);

  return (
    <div className="clouds-container">
      <div
        className={
          isReady ? (!isPaused ? "clouds clouds-animate" : "clouds") : "clouds"
        }
      ></div>
    </div>
  );
};
export default Clouds;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Birds.css";

const Birds = () => {
  const [isReady, setIsReady] = useState(false);
  const isPaused = useSelector((state) => state.engine.pause);

  // check if document is loaded before animating brids
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
    <div className="birds-container">
      <div
        className={
          isReady ? (!isPaused ? "birds birds-animate" : "birds") : "birds"
        }
      ></div>
    </div>
  );
};
export default Birds;

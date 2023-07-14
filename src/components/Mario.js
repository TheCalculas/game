import "./Mario.css";
import MarioCharacter from "../assets/mario-run.gif";
import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import jumpAudio from "../assets/audio/mario-jump.mp3";
import backgroundMusic from "../assets/audio/running-about.mp3";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  marioJumping,
  marioHeight,
  marioLeft,
  marioTop,
  marioWidth,
} from "../redux/marioSlice";
import {
  setReady,
  setPause,
  setDie,
  setScore,
  setMessage,
} from "../redux/engineSlice";

// die
import dieAudio from "../assets/audio/mario-died.mp3";

const Mario = () => {
  const marioRef = useRef();
  const dispatch = useDispatch();
  const die = useSelector((state) => state.engine.die);
  const loadingScreen = useSelector((state) => state.engine.loadingScreen);

  const isPaused = useSelector((state) => state.engine.pause);
  const isPlay = useSelector((state) => state.engine.play);
  const score = useSelector((state) => state.engine.score);
  // Mario positions & jump
  const mario_jump = useSelector((state) => state.mario.jumping);
  const mario_height = useSelector((state) => state.mario.height);
  const mario_left = useSelector((state) => state.mario.left);
  const mario_top = useSelector((state) => state.mario.top);
  const mario_width = useSelector((state) => state.mario.width);
  // Obstacle1 positions
  const obs1_height = useSelector((state) => state.obstacle.obs1Height);
  const obs1_left = useSelector((state) => state.obstacle.obs1Left);
  const obs1_top = useSelector((state) => state.obstacle.obs1Top);
  const obs1_width = useSelector((state) => state.obstacle.obs1Width);
  // Obstacle2 positions
  const obs2_height = useSelector((state) => state.obstacle.obs2Height);
  const obs2_left = useSelector((state) => state.obstacle.obs2Left);
  const obs2_top = useSelector((state) => state.obstacle.obs2Top);
  const obs2_width = useSelector((state) => state.obstacle.obs2Width);

  const [waiting, setWaiting] = useState(false);

  // Jump audio
  const jump = useMemo(() => {
    return new Audio(jumpAudio);
  }, []);

  // Die
  const marioDie = useMemo(() => {
    return new Audio(dieAudio);
  }, []);

  const bgMusic = useMemo(() => {
    return new Audio(backgroundMusic);
  }, []);

  // Handling key press event.
  const handleKey = useCallback(
    (e) => {
      if (
        e.code === "Enter" &&
        !isPlay &&
        !die &&
        !loadingScreen &&
        !isPaused
      ) {
        dispatch(setReady(true));
      }
      if (
        mario_jump === false &&
        e.code === "Space" &&
        isPlay &&
        !die &&
        !loadingScreen
      ) {
        dispatch(marioJumping(true));
        jump.play();
        setTimeout(() => {
          dispatch(marioJumping(false));
          jump.pause();
          jump.currentTime = 0;
        }, 400);
      }
    },
    [mario_jump, jump, dispatch, isPlay, die, loadingScreen]
  );

  const handleCollision = async () => {
    dispatch(setPause(true));
    dispatch(
      setMessage(
        "You have encountered a virus. Now it's upto your defender to save you!!!"
      )
    );
    let checkPoint = 1;
    if (score >= 0 && score <= 50) {
      checkPoint = 1;
    } else if (score > 50 && score <= 100) {
      checkPoint = 2;
    } else {
      checkPoint = 3;
    }
    const response = await fetch(`http://localhost:5000/player/obstacleHit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkPoint: checkPoint,
      }),
    });
    let resData = await response.json();
    if (response.status === 400) {
      console.log(resData);
    } else if (response.status === 200) {
      setWaiting(true);
      // console.log(waiting);
    } else if (response.status === 500) {
      console.log(resData);
    }
  };

  const handleWaiting = async () => {
    while (waiting) {
      // setInterval(async () => {
        const response2 = await fetch(
          `http://localhost:5000/player/checkWait`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // checkPoint: checkPoint,
            }),
          }
        );
        let resData2 = await response2.json();
        if (response2.status === 400) {
          console.log(resData2);
        } else if (response2.status === 200) {
          if (resData2.isWait === false) {
            setWaiting(false);
            if (resData2.user === "Defender") {
              dispatch(setPause(false));
            }
            if (resData2.user === "Attacker") {
              dispatch(setPause(false));
              dispatch(setDie(true));
              marioDie.play();
              dispatch(setReady(false));
              setTimeout(() => {
                dispatch(setDie(false));
              }, 2000);
              setTimeout(() => {
                dispatch(setScore(0));
              }, 100);
            }
          }
        } else if (response2.status === 500) {
          console.log(resData2);
        }
      // }, 2000);
    }
  };

  useEffect(() => {
    if (waiting === true) {
      handleWaiting();
    }
  }, [waiting]);

  useEffect(() => {
    if (score === 50) {
      dispatch(setPause(true));
      dispatch(
        setMessage(
          "You have successfully received your confirmation email for the hackathon. Now Entering MiMA Zone"
        )
      );
      setTimeout(() => {
        dispatch(setPause(false));
      }, 4000);
    } else if (score === 100) {
      dispatch(setPause(true));
      dispatch(
        setMessage(
          "You have successfully received your Travel Details for the hackathon. Now Entering DDoS Zone"
        )
      );
      setTimeout(() => {
        dispatch(setPause(false));
      }, 4000);
    }
    // } else if (score === 150) {
    //   dispatch(setPause(true));
    //   dispatch(
    //     setMessage(
    //       "You have successfully reached your hackathon destination."
    //     )
    //   );
    //   setTimeout(() => {
    //     dispatch(setPause(false));
    //   }, 4000);
    // }
    if (score === 200) {
      dispatch(
        setMessage(
          "You have successfully been able to work through the challenges and have won the Hackathon"
        )
      );
      dispatch(setDie(true));
      dispatch(setPause(true));
      setTimeout(() => {
        dispatch(setReady(false));
        dispatch(setDie(false));
        dispatch(setPause(false));
        dispatch(setScore(0));
      }, 4000);
    }
    if (
      mario_left < obs1_left + obs1_width &&
      mario_left + mario_width > obs1_left &&
      mario_top < obs1_top + obs1_height &&
      mario_top + mario_height > obs1_top
    ) {
      handleCollision();
    }

    if (
      mario_left < obs2_left + obs2_width &&
      mario_left + mario_width > obs2_left &&
      mario_top < obs2_top + obs2_height &&
      mario_top + mario_height > obs2_top
    ) {
      handleCollision();
    }
  }, [
    mario_left,
    obs1_left,
    obs1_width,
    mario_width,
    mario_top,
    obs1_top,
    obs1_height,
    mario_height,
    dispatch,
    marioDie,
    obs2_left,
    obs2_width,
    obs2_top,
    obs2_height,
    score,
  ]);

  // Monitor key press.
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    dispatch(marioHeight(marioRef.current.getBoundingClientRect().height));
    dispatch(marioLeft(marioRef.current.getBoundingClientRect().left));
    dispatch(marioTop(marioRef.current.getBoundingClientRect().top));
    dispatch(marioWidth(marioRef.current.getBoundingClientRect().width));

    if (isPlay) {
      bgMusic.play();
    } else {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
  }, [handleKey, dispatch, bgMusic, isPlay, isPaused]);

  return (
    <div className="mario-container">
      {!die && (
        <img
          src={MarioCharacter}
          alt=""
          className={`mario ${mario_jump ? "jump" : ""}`}
          ref={marioRef}
        />
      )}
      {die && (
        <img
          src={MarioCharacter}
          alt=""
          className={`mario ${die ? "die" : ""}`}
          ref={marioRef}
        />
      )}
    </div>
  );
};
export default Mario;

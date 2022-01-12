import React, { useState, useEffect } from "react";

import { CircularProgressbar as Progress } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import "./styles.css";

import workIcon from "../icons/hard-hat-solid.svg";
import breakIcon from "../icons/mug-hot-solid.svg";

const POMODORO_TYPES = {
  WORK: {
    type: "work",
    text: "Focus",
    duration: 25 * 60,
  },
  BREAK: {
    type: "break",
    text: "Break",
    duration: 5 * 60,
  },
  LONG_BREAK: {
    type: "break",
    text: "Break",
    duration: 15 * 60,
  },
};

function Pomodoro(props) {
  const pomodoroConfig = [
    POMODORO_TYPES.WORK,
    POMODORO_TYPES.BREAK,
    POMODORO_TYPES.WORK,
    POMODORO_TYPES.BREAK,
    POMODORO_TYPES.WORK,
    POMODORO_TYPES.BREAK,
    POMODORO_TYPES.WORK,
    POMODORO_TYPES.LONG_BREAK,
  ];

  const [currentPomodoroIndex, setCurrentPomodoroIndex] = useState(0);
  const [currentPomodoroTime, setCurrentPomodoroTime] = useState(
    pomodoroConfig[currentPomodoroIndex].duration
  );
  const [started, setStated] = useState(false);

  const [tick, setTick] = useState(0);

  const currentPomodoro = pomodoroConfig[currentPomodoroIndex];
  let interval;

  function beep() {
    var snd = new Audio(
      "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
    );
    snd.play();
  }

  useEffect(() => {
    if (started) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      interval = setInterval(() => {
        if (started) {
          setTick((prevTick) => prevTick + 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [started]);

  useEffect(() => {
    if (started) {
      if (currentPomodoroTime > 0) {
        setCurrentPomodoroTime((prevState) => prevState - 1);
      } else {
        if (currentPomodoroIndex < pomodoroConfig.length - 1) {
          setCurrentPomodoroIndex(
            (currentPomodoroIndex) => currentPomodoroIndex + 1
          );
          setCurrentPomodoroTime(
            pomodoroConfig[currentPomodoroIndex + 1].duration
          );
        } else {
          setCurrentPomodoroIndex(0);
          setCurrentPomodoroTime(pomodoroConfig[0].duration);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  useEffect(() => {
    document.title = currentPomodoro.text;
    changeFavicon();

    if (started) {
      if (currentPomodoro.type === "work") {
        beep();
        setTimeout(() => {
          beep();
        }, 500);
      } else {
        beep();
      }
    }
  }, [currentPomodoro]);

  const changeFavicon = () => {
    const favicon = document.querySelector('[rel="icon"]');

    console.log(favicon);

    favicon.href = currentPomodoro.type === "break" ? breakIcon : workIcon;
  };

  const nextPomodoro = () => {
    if (currentPomodoroIndex < pomodoroConfig.length - 1) {
      setCurrentPomodoroIndex(
        (currentPomodoroIndex) => currentPomodoroIndex + 1
      );
      setCurrentPomodoroTime(pomodoroConfig[currentPomodoroIndex + 1].duration);
    } else {
      setCurrentPomodoroIndex(0);
      setCurrentPomodoroTime(pomodoroConfig[0].duration);
    }
  };

  const prevPomodoro = () => {
    if (currentPomodoroIndex > 0) {
      setCurrentPomodoroIndex(
        (currentPomodoroIndex) => currentPomodoroIndex - 1
      );
      setCurrentPomodoroTime(pomodoroConfig[currentPomodoroIndex - 1].duration);
    } else {
      setCurrentPomodoroIndex(() => pomodoroConfig.length - 1);
      setCurrentPomodoroTime(
        pomodoroConfig[pomodoroConfig.length - 1].duration
      );
    }
  };

  const handleReset = () => {
    setStated(false);
    setCurrentPomodoroTime(pomodoroConfig[currentPomodoroIndex].duration);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  return (
    <div className={`pomodoro-container type-${currentPomodoro.type}`}>
      <div className="progress-container">
        <Progress
          value={currentPomodoro.duration - currentPomodoroTime}
          maxValue={currentPomodoro.duration}
          text={formatTime(currentPomodoroTime)}
          strokeWidth={2}
        />
      </div>
      <div className="current-status">
        {currentPomodoroIndex + 1}/{pomodoroConfig.length} -{" "}
        {currentPomodoro.text}
      </div>
      <div className="buttons-container">
        <button onClick={prevPomodoro}>Prev</button>
        <button
          onClick={() => {
            clearInterval(interval);
            setStated(!started);
          }}
        >
          {started ? "Pause" : "Start"}
        </button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={nextPomodoro}>Next</button>
      </div>
    </div>
  );
}

export default Pomodoro;

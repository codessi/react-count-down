//https://codepen.io/search/pens?q=react+countdown+&cursor=ZD0xJm89MCZwPTQ=
import './App.css';

import React from 'react'

const SET_ENDTIME = 'SET_ENDTIME';
const SET_TIMELEFT = 'SET_TIMELEFT';
const SET_SECONDS = 'SET_SECONDS';
const SET_PAUSED = 'SET_PAUSED';
 
const initialState = {
  adjustedHour: 0,
  endMinutes: 0,
  remainderSeconds: 0,
  seconds: 0,
  inputSeconds: 0,
  minutesLeft: 0,
  paused: false
}

function reducer(state, action) {
  if (action.type === SET_TIMELEFT) {
    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === SET_ENDTIME) {
    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === SET_SECONDS) {
    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === SET_PAUSED) {
    return {
      ...state,
      ...action.payload
    };
  }
}

function App() {
  // const [inputSeconds, setInputSeconds] = React.useState(0);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { adjustedHour, endMinutes, remainderSeconds, seconds, minutesLeft, paused } = state;

  const timerRef = React.useRef(null);

  function displayTimeLeft(seconds) {
    const minutesLeft = Math.floor(seconds / 60);
    dispatch({
      type: SET_TIMELEFT,
      payload:{
        remainderSeconds: seconds,
        minutesLeft
      }
    })
  }

  function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const adjustedHour = hour > 12 ? hour - 12 : hour;
    const endMinutes = end.getMinutes();
    dispatch({
      type: SET_ENDTIME,
      payload:{
        adjustedHour,
        endMinutes
      }
    })
  }

  function clearTimer() {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
 
  React.useEffect(() => {
    const now = Date.now();
    const then = now + seconds * 1000;  
    clearTimer()
    displayTimeLeft(seconds);
    displayEndTime(then);

    if (!paused) {
      timerRef.current = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop it!
        if(secondsLeft < 0) {
          clearTimer();
          return setSeconds(0);
        }
        // display it
        displayTimeLeft(secondsLeft);
      }, 200);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [seconds, paused]);

  function startTimer(x) {
    const parsedSeconds = parseInt(x);
    dispatch({
      type: SET_SECONDS,
      payload:{
        seconds: parsedSeconds,
        paused: false
      }
    })
  }

  function setSeconds(seconds) {
    dispatch({
      type: SET_SECONDS,
      payload:{
        seconds
      }
    })
  }

  const setPaused = (paused) => {
    dispatch({
      type: SET_PAUSED,
      payload:{
        paused,
        seconds: paused ? remainderSeconds : remainderSeconds-1
      }
    })
  }

  function pauseTimer() {
    setPaused(!paused);
  }

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   dispatch({
  //     type: SET_SECONDS,
  //     payload:{
  //       seconds: inputSeconds
  //     }
  //   })
  // }

  // function handleChange(event) {
  //   setInputSeconds(event.target.value);
  // }

  return (
    <div className="App">
      <div className="timer__controls top">
        <button onClick={() => startTimer(20)} className="timer__button">20s</button>
        <button onClick={() => startTimer(300)} className="timer__button">5m</button>
        <button onClick={() => startTimer(900)} className="timer__button">15m</button>
        <button onClick={() => startTimer(1200)} className="timer__button">20m</button>
        <button onClick={() => startTimer(3600)} className="timer__button">1h</button>
      </div>
      <div className={`display`}>
        <h1 className={`display__time-left ${((remainderSeconds > 0) || (minutesLeft > 0)) ? `timer-running` : 'timer-not-running'}`}>{`${minutesLeft}:${remainderSeconds % 60 < 10 ? '0' : '' }${remainderSeconds % 60}`}</h1>
        <p className="display__end-time">{`Done At ${adjustedHour}:${endMinutes < 10 ? '0' : ''}${endMinutes}`}</p>
      </div>

      <div className="timer__controls bottom">
        {/* <form name="customForm" id="custom" onSubmit={handleSubmit}>
          <input type="text" name="minutes" placeholder="Enter Minutes" value={inputSeconds} onChange={handleChange}/>
        </form> */}
        <button onClick={() => pauseTimer()} className="timer__button" disabled={!seconds ? true : false}>Pause</button>
      </div>
    </div>
  );
}

export default  App

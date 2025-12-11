import { useRef, useState, MouseEvent, useEffect, JSX } from 'react';
import { isNil } from 'lodash';
import { useAppSelector } from '../../hooks/hooks';
import { selectFilmName, selectVideoLink } from '../../store/player-slice';
import { getRunTime } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../const';

function PlayerPage(): JSX.Element {
  const videoLink = useAppSelector(selectVideoLink);
  const filmName = useAppSelector(selectFilmName);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [runTimeSeconds, setRunTime] = useState(0);
  const [currentTimePercentage, setCurrentTimePercentage] = useState(0);
  const [leftTimeValue, setLeftTimeValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const timer = setInterval(() => {
      if (!isMounted) {
        return;
      }

      const duration = vidRef.current?.duration ?? 0;
      const currentTime = vidRef.current?.currentTime ?? 0;

      setIsPaused(false);

      if (
        Number.isFinite(duration)
        && duration > 0
      ) {
        setRunTime(duration);
        setCurrentTimePercentage((currentTime * 100) / (duration));
        setLeftTimeValue(duration - currentTime);
        if(vidRef.current?.paused) {
          setIsPaused(() => true);
        }
      } else {

        setLeftTimeValue(0);
      }
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  });

  const handlePlayVideo = () => {
    if (!vidRef.current) {
      return;
    }

    setIsPaused(!isPaused);

    if(isPaused){
      vidRef.current.play();
    } else {
      vidRef.current.pause();
    }
  };

  const handleFullscreen = () => {
    vidRef.current?.requestFullscreen();
  };

  const handleExit = () => {
    vidRef.current?.pause();
    navigate(AppRoute.Main);
  };

  function handleProgressClick(evt: MouseEvent<HTMLProgressElement>) {
    if (evt.target instanceof HTMLProgressElement && !isNil(runTimeSeconds)) {
      const progressInPercent = (evt.clientX - evt.target.getBoundingClientRect().x) / evt.target.offsetWidth * 100;
      vidRef.current!.currentTime = runTimeSeconds * progressInPercent / 100;
      setCurrentTimePercentage(progressInPercent);
    }
  }

  return (
    <div className="player">
      <video ref={vidRef} className="player__video" poster="img/player-poster.jpg" muted autoPlay>
        <source src={videoLink} type="video/mp4" />
      </video>
      <button onClick={handleExit} type="button" className="player__exit">
        Exit
      </button>
      <div className="player__controls">
        <div className="player__controls-row">
          <div className="player__time">
            <progress onClick={handleProgressClick} className="player__progress" value={currentTimePercentage} max={100} />
            <div className="player__toggler" style={{ left: `${currentTimePercentage}%` }}>
              Toggler
            </div>
          </div>
          <div className="player__time-value">{`-${getRunTime(leftTimeValue)}`}</div>
        </div>
        <div className="player__controls-row">
          <button onClick={handlePlayVideo} type="button" className="player__play">
            <svg viewBox="0 0 19 19" width={19} height={19}>
              <use xlinkHref={isPaused ? '#play-s' : '#pause'} />
            </svg>
            <span>Play</span>
          </button>
          <div className="player__name">{filmName}</div>
          <button onClick={handleFullscreen} type="button" className="player__full-screen">
            <svg viewBox="0 0 27 27" width={27} height={27}>
              <use xlinkHref="#full-screen" />
            </svg>
            <span>Full screen</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;

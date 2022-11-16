import { MouseEventHandler, useEffect, useState, useContext } from "react";
import { CurrentlyPlayingInterface, TestContext } from "./Flow";
import {
  getPlayerState,
  pausePlayer,
  playPlayer,
  skipToNext,
  skipToPrev,
} from "../helpers/spotify";
import Image from "next/image";
import Marquee from "react-marquee-slider";

import { BsFillSkipStartFill, BsFillSkipEndFill } from "react-icons/bs";
import { isContext } from "vm";
import { arrToStr } from "../helpers/general";

interface PlayerButtonInterface {
  onPlayerClick: MouseEventHandler;
}

const buttonStyle = {
  width: 20,
  height: 20,
  cursor: "pointer",
};

const Pause = ({ onPlayerClick }: PlayerButtonInterface) => {
  return (
    <svg
      style={buttonStyle}
      className="button"
      viewBox="0 0 60 60"
      onClick={onPlayerClick}
    >
      <polygon points="0,0 15,0 15,60 0,60" />
      <polygon points="25,0 40,0 40,60 25,60" />
    </svg>
  );
};

const Play = ({ onPlayerClick }: PlayerButtonInterface) => {
  return (
    <svg
      style={buttonStyle}
      className="button"
      viewBox="0 0 60 60"
      onClick={onPlayerClick}
    >
      <polygon points="0,0 50,30 0,60" />
    </svg>
  );
};

const skipSize = 24;
const expSkipWidth = 184;

const Player = ({
  currentlyPlaying,
}: {
  currentlyPlaying: CurrentlyPlayingInterface;
}) => {
  const [playing, setPlaying] = useState(false);
  const flowContext = useContext(TestContext);
  const [trackVelocity, setTrackVelocity] = useState(10);

  // const detectKeyDown = async (e: any) => {
  //   if (e.key === " ") {
  //     console.log("bruh");
  //     if (playing) {
  //       setPlaying(false);
  //       pausePlayer(flowContext);
  //     } else {
  //       setPlaying(true);
  //       playPlayer(flowContext);
  //     }
  //   }
  // };

  const onLoad = async () => {
    setPlaying(await getPlayerState(flowContext));
  };

  useEffect(() => {
    onLoad();
    // document.addEventListener("keydown", detectKeyDown, true);
  }, []);

  useEffect(() => {
    if (flowContext?.checkStateTime) {
      setTimeout(() => onLoad(), flowContext?.checkStateTime + 100);
    }
  }, [flowContext?.checkStateTime]);

  const handleClick = async () => {
    if (playing) {
      setPlaying(false);
      pausePlayer(flowContext);
    } else {
      setPlaying(true);
      playPlayer(flowContext);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        bottom: 0,
        left: 100,
        padding: "12px 10px 8px",
        backgroundColor: "white",
        border: "1px solid black",
        borderBottom: "none",
        borderRadius: "10px 10px 0 0",
        zIndex: 10,
        maxWidth: 450,
        minWidth: 450,
      }}
    >
      {flowContext?.playerThumbnail && (
        <Image
          src={flowContext?.playerThumbnail}
          width={45}
          height={45}
          alt={currentlyPlaying.track}
          style={{
            marginTop: -3,
            marginRight: 10,
          }}
        />
      )}
      <BsFillSkipStartFill
        size={skipSize}
        style={{
          marginTop: -3,
          marginRight: 8,
          cursor: "pointer",
          // width: expSkipWidth,
        }}
        onClick={async () => skipToPrev(flowContext)}
      />
      <div>
        {playing ? (
          <Pause onPlayerClick={handleClick} />
        ) : (
          <Play onPlayerClick={handleClick} />
        )}
      </div>
      <BsFillSkipEndFill
        size={skipSize}
        style={{
          marginTop: -3,
          cursor: "pointer",
          // width: expSkipWidth
        }}
        onClick={async () => skipToNext(flowContext)}
      />
      <div
        style={{ marginLeft: 10, marginTop: -4, maxWidth: 287 }}
        onMouseEnter={() => setTrackVelocity(0)}
        onMouseLeave={() => setTrackVelocity(10)}
      >
        {currentlyPlaying.track.length > 35 ? (
          <Marquee
            velocity={trackVelocity}
            direction="rtl"
            scatterRandomly={false}
            resetAfterTries={100}
            onInit={() => {}}
            onFinish={() => {}}
          >
            <div style={{ marginRight: 20 }}>{currentlyPlaying.track}</div>
            <div style={{ marginRight: 20 }}>{currentlyPlaying.track}</div>
          </Marquee>
        ) : (
          <div>{currentlyPlaying.track}</div>
        )}

        <div style={{ fontSize: 14 }}>
          {currentlyPlaying.artists.map((artist: any, index) => {
            return (
              <>
                <span key={index} style={{ cursor: "pointer" }}>
                  {artist.name}
                </span>
                {index < currentlyPlaying.artists.length - 1 && ", "}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Player;

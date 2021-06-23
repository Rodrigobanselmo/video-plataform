import React, { useState, useRef, useEffect } from "react";
import { findDOMNode } from "react-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import ReactPlayer from "react-player";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeMute from "@material-ui/icons/VolumeOff";
import FullScreen from "@material-ui/icons/Fullscreen";
import Popover from "@material-ui/core/Popover";
import screenful from "screenfull";
import Controls from "./controls";
import useKeypress from 'react-use-keypress';
import Fade from '@material-ui/core/Fade';
import styled from "styled-components";

const ReactPlayerStyles = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;


const PlayerWrapper = styled.div`
    /* width: 100%; */
    padding-top: 56.25%;
    display: flex;
    width:100%;
    /* height:100%; */
    position: relative;
`;

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

export function VideoPlayer() {
  const [showControls, setShowControls] = useState(false);
  // const [count, setCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
  const [state, setState] = useState({
    pip: false,
    playing: false,
    controls: false,
    light: false,
    muted: false,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const progressRef = useRef(null);
  const progressTimeRef = useRef(null);
  const progressLoadRef = useRef(null);
  const {
    playing,
    controls,
    light,
    muted,
    loop,
    playbackRate,
    pip,
    played,
    seeking,
    volume,
  } = state;


  const duration = playerRef && playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const currentTime = playerRef && playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const elapsedTime = timeDisplayFormat == "normal"
    ? format(currentTime)
    : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  const onReady = () => {
    console.log(playerRef.current.getDuration())
    progressTimeRef.current.innerText = totalDuration
    setState({ ...state, duration:totalDuration });
  };

  const handlePlayPause = () => {
    // if (state.playing) controlsRef.current.style.opacity = 1
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5);
  };

  const handleProgress = (changeState) => {

    console.log(count)
    if (count > 8) {
      controlsRef.current.style.opacity = 0;
      controlsRef.current.style.cursor = 'none';
      count = 0;
    }

    if (controlsRef.current.style.opacity == 1) {
      count += 1;
    }

    if (!state.seeking) {
      const TIME = playerRef && playerRef.current ? format(playerRef.current.getCurrentTime()) : format(playerRef.current.getDuration());

      progressTimeRef.current.innerText = TIME
      progressTimeRef.current.style.transform = `translateX(${changeState.played*100*4/400*progressRef.current.offsetWidth}px)`
      progressRef.current.value = `${changeState.played*100*4}`
      progressLoadRef.current.style.width = `${changeState.loaded*100}%`
    }
  };

  const handleSeekChange = (e, newValue) => {
    playerRef.current.seekTo(parseFloat(newValue / 400),'fraction');
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100, "fraction");
  };

  const handleVolumeChange = (newValue) => {
    setState({
      ...state,
      volume: newValue>1?1:newValue<0?0:newValue,
    });
  };

  const toggleFullScreen = () => {
    if (screenful.isFullscreen) controlsRef.current.style.padding= '0px'
    else controlsRef.current.style.padding = '45px 0'
    screenful.toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    controlsRef.current.style.opacity = "1";
    controlsRef.current.style.cursor = 'default';
    count = 0;
  };

  const hanldeMouseLeave = () => {
    if (!state.playing) return
    controlsRef.current.style.opacity = "0";
    count = 0;
  };


  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  useKeypress([' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'], (e) => {
    console.log('e.key',e.key)
    if (e.key === ' ') {
      handlePlayPause();
    } else if  (e.key === 'ArrowLeft') {
      handleRewind()
    } else if  (e.key === 'ArrowRight') {
      handleFastForward()
    } else if  (e.key === 'ArrowUp') {
      if (volume<1) handleVolumeChange(volume+0.2)
      console.log(volume)
    } else if  (e.key === 'ArrowDown') {
      if (volume>0) handleVolumeChange(volume-0.2)
    }
    // Do something when the user has pressed the Escape key
  });

  return (
    <div style={{maxWidth:1200,display:'flex',flexDirection:'row',width:'100%'}}>
      <PlayerWrapper
        onMouseMove={handleMouseMove}
        onMouseLeave={hanldeMouseLeave}
        ref={playerContainerRef}
      >
        <ReactPlayerStyles
          ref={playerRef}
          width="100%"
          style={{backgroundColor:'red'}}
          height="100%"
          url="https://firebasestorage.googleapis.com/v0/b/reconecta-dev.appspot.com/o/Parte-01-Vi%CC%81deo-0001%20(0001-0003)-G.m4v?alt=media&token=d1a3d63b-4a85-4dd5-b0c2-24e88ddd6e65"
          pip={pip}
          playing={playing}
          controls={false}
          light={light}
          loop={loop}
          playbackRate={playbackRate}
          volume={volume}
          muted={muted}
          progressInterval={250}
          onProgress={handleProgress}
          onReady={onReady}
        />

        <Controls
          ref={controlsRef}
          progressRef={progressRef}
          progressTimeRef={progressTimeRef}
          progressLoadRef={progressLoadRef}
          playerRef={playerRef}
          format={format}
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          onRewind={handleRewind}
          onPlayPause={handlePlayPause}
          onFastForward={handleFastForward}
          playing={playing}
          played={played}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          muted={muted}
          onVolumeChange={handleVolumeChange}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRate}
          onToggleFullScreen={toggleFullScreen}
          volume={volume}
        />
      </PlayerWrapper>
      <div style={{width:'500px',marginLeft:'30px',backgroundColor:'#aeaeae'}}>

      </div>
    </div>
  );
}

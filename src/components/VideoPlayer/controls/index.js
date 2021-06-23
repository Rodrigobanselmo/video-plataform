import React, { forwardRef, useState,useRef } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import FastForwardIcon from "@material-ui/icons/FastForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeMute from "@material-ui/icons/VolumeOff";
import FullScreen from "@material-ui/icons/Fullscreen";
import Popover from "@material-ui/core/Popover";
import { useResizeDetector } from 'react-resize-detector';
import useKeypress from 'react-use-keypress';
import { useGesture } from 'react-use-gesture'
import { ProgressBar,BottomCrontols,ControlsWrapper,SoundFill,SoundView,SoundColumn,IconCog,PlayView,ProgressView,TooltipSpan,TooltipMouseSpan,ProgressInput,ProgressContainer, } from './style'

//https://www.youtube.com/watch?v=Y-OLcnr8eNo&list=PL4OKShK9gkQca9QVqmnPMzT6QYM2LHaqt&index=8

const Controls = forwardRef(
  (
    {
      progressRef,
      progressTimeRef,
      progressLoadRef,
      playerRef,
      format,
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      onRewind,
      onPlayPause,
      onFastForward,
      playing,
      played,
      elapsedTime,
      totalDuration,
      onMute,
      muted,
      onChangeDispayFormat,
      playbackRate,
      onPlaybackRateChange,
      onToggleFullScreen,
      volume,
      onVolumeChange,
      onBookmark,
    },
    ref
  ) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const progressMouseRef = useRef(null);
    const soundRef = useRef(null)
    const { width, height, ref:resizeRef } = useResizeDetector();

    React.useEffect(() => {
      progressTimeRef.current.style.transform = totalDuration
      progressTimeRef.current.style.transform = `translateX(${progressRef.current.value/400*progressRef.current.offsetWidth}px)`
    }, [width])

    React.useEffect(() => {
      if (muted) {
        onSetSound(0.01)
      } else {
        onSetSound(volume-0.01)
      }
    }, [volume,muted])

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };


    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleProgressChange = (e) => {
      console.log(parseFloat(e.target.value/400))
      playerRef.current.seekTo(parseFloat(e.target.value/400),'fraction');
      progressTimeRef.current.style.transform = `translateX(${e.target.value/400*progressRef.current.offsetWidth}px)`

    };

    const handleMouseMove = (e) => {

      const widthProgress = progressRef.current.offsetWidth;
      const offSet = e.nativeEvent.offsetX;

      const TIME = playerRef && playerRef.current ? format(playerRef.current.getDuration()*offSet/widthProgress) : '00:00';

      if (offSet >= 0 && offSet <= widthProgress) {
        progressMouseRef.current.innerText = TIME
        progressMouseRef.current.style.opacity = '0.9';
        progressMouseRef.current.style.transform = `translateX(${offSet}px)`
      }
    };

    const hanldeMouseLeave = () => {
        progressMouseRef.current.style.opacity = '0';
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;


    function onSetSound(percentage) {

      const first = soundRef.current.children[0];
      const second = soundRef.current.children[1];
      const third = soundRef.current.children[2];
      const fourth = soundRef.current.children[3];
      const five = soundRef.current.children[4];

      const x = percentage*23;

      if (x<0) first.children[0].style.transform = `translateX(-${3}px)`
      if (x>0&&x<3) first.children[0].style.transform = `translateX(-${3-x}px)`
      if (x>3) first.children[0].style.transform = `translateX(-${0}px)`

      if (x<5) second.children[0].style.transform = `translateX(-${3}px)`
      if (x>5&&x<8) second.children[0].style.transform = `translateX(-${3-x+5}px)`
      if (x>8) second.children[0].style.transform = `translateX(-${0}px)`

      if (x<10) third.children[0].style.transform = `translateX(-${3}px)`
      if (x>10&&x<13) third.children[0].style.transform = `translateX(-${3-x+10}px)`
      if (x>13) third.children[0].style.transform = `translateX(-${0}px)`

      if (x<15) fourth.children[0].style.transform = `translateX(-${3}px)`
      if (x>15&&x<18) fourth.children[0].style.transform = `translateX(-${3-x+15}px)`
      if (x>18) fourth.children[0].style.transform = `translateX(-${0}px)`

      if (x<20) five.children[0].style.transform = `translateX(-${3}px)`
      if (x>20&&x<23) five.children[0].style.transform = `translateX(-${3-x+20}px)`
      if (x>23) five.children[0].style.transform = `translateX(-${0}px)`
    }

    const bind = useGesture({
      onDragStart: () => {
        soundRef.current.style.cursor = 'grabbing';
      },
      onDrag: ({event,down}) => {
        const rect = soundRef.current.getBoundingClientRect()
        const x = event.clientX - rect.left;

        const first = soundRef.current.children[0];
        const second = soundRef.current.children[1];
        const third = soundRef.current.children[2];
        const fourth = soundRef.current.children[3];
        const five = soundRef.current.children[4];

          if (x>0 && x<3 ) {
            first.children[0].style.height = `${12*0.2+4}px`
          } else {
            first.children[0].style.height = null
          }

          if (x>5 && x<8) {
            second.children[0].style.height = `${12*0.4+4}px`
          } else {
            second.children[0].style.height = null
          }

          if (x>10 && x<13) {
            third.children[0].style.height = `${12*0.6+4}px`
          } else {
            third.children[0].style.height = null
          }

          if (x>15 && x<18) {
            fourth.children[0].style.height = `${12*0.8+4}px`
          } else {
            fourth.children[0].style.height = null
          }

          if (x>20 && x<23) {
            five.children[0].style.height = `${12+4}px`
          } else {
            five.children[0].style.height = null
          }

          onSetSound(x/23)
      },
      onDragEnd: ({event}) => {
        const rect = soundRef.current.getBoundingClientRect()
        const x = event.clientX - rect.left;

        onVolumeChange(x/23)

        soundRef.current.style.cursor = 'pointer';
        soundRef.current.children[0].children[0].style.height = null
        soundRef.current.children[1].children[0].style.height = null
        soundRef.current.children[2].children[0].style.height = null
        soundRef.current.children[3].children[0].style.height = null
        soundRef.current.children[4].children[0].style.height = null
      },
    })

    return (
      <ControlsWrapper ref={ref} >
          <div style={{display:'flex',flex:1}} onDoubleClick={onToggleFullScreen} onClick={onPlayPause}/>
          <BottomCrontols onClick={()=>{}} >
            <PlayView onDoubleClick={onToggleFullScreen} onClick={onPlayPause}>
              {playing ? (
                <PauseIcon fontSize="large" />
              ) : (
                <PlayArrowIcon fontSize="large" />
              )}
            </PlayView>
            <ProgressView >
              <ProgressContainer ref={resizeRef}>
                <TooltipMouseSpan ref={progressMouseRef}>00:00</TooltipMouseSpan>
                <TooltipSpan ref={progressTimeRef} >00:00</TooltipSpan>
                <ProgressBar ref={progressLoadRef}/>
                <ProgressInput style={{margin:0,padding:0}} onMouseMove={handleMouseMove} onMouseLeave={hanldeMouseLeave} onChange={handleProgressChange} defaultValue={0} ref={progressRef} type="range" min="1" max="400"/>
              </ProgressContainer>
              <SoundView ref={soundRef} {...bind()}>
                {[0.2,0.4,0.6,0.8,1.0].map(item=>{
                  return (
                    <SoundColumn key={item} percentage={item}>
                      <SoundFill item={item}/>
                    </SoundColumn>
                  );
                })}
              </SoundView>
              <IconCog onClick={()=>{soundRef.current.name = 10}} style={{fontSize:20}} rotateCog={true} />
              <FullScreen onClick={onToggleFullScreen}/>
            </ProgressView>
          </BottomCrontols>
{/*
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ padding: 16 }}
          >
            <Grid item>
              <Button
                onClick={handleClick}
                aria-describedby={id}
                className={classes.bottomIcons}
                variant="text"
              >
                <Typography>{playbackRate}X</Typography>
              </Button>

              <Popover
                container={ref.current}
                open={open}
                id={id}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid container direction="column-reverse">
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <Button
                      key={rate}
                      //   onClick={() => setState({ ...state, playbackRate: rate })}
                      onClick={() => onPlaybackRateChange(rate)}
                      variant="text"
                    >
                      <Typography
                        color={rate === playbackRate ? "secondary" : "inherit"}
                      >
                        {rate}X
                      </Typography>
                    </Button>
                  ))}
                </Grid>
              </Popover>
            </Grid>
          </Grid>
         */}
      </ControlsWrapper>
    );
  }
);

// Controls.propTypes = {
//   onSeek: PropTypes.func,
//   onSeekMouseDown: PropTypes.func,
//   onSeekMouseUp: PropTypes.func,
//   onDuration: PropTypes.func,
//   onRewind: PropTypes.func,
//   onPlayPause: PropTypes.func,
//   onFastForward: PropTypes.func,
//   onVolumeSeekDown: PropTypes.func,
//   onChangeDispayFormat: PropTypes.func,
//   onPlaybackRateChange: PropTypes.func,
//   onToggleFullScreen: PropTypes.func,
//   onMute: PropTypes.func,
//   playing: PropTypes.bool,
//   played: PropTypes.number,
//   elapsedTime: PropTypes.string,
//   totalDuration: PropTypes.string,
//   muted: PropTypes.bool,
//   playbackRate: PropTypes.number,
// };
export default Controls;

import React, { forwardRef, useState, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import TimerRoundedIcon from '@material-ui/icons/TimerRounded';
import AccessTimeSharpIcon from '@material-ui/icons/AccessTimeSharp';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeMute from '@material-ui/icons/VolumeOff';
import FullScreen from '@material-ui/icons/Fullscreen';
import Popover from '@material-ui/core/Popover';
import { useResizeDetector } from 'react-resize-detector';
import useKeypress from 'react-use-keypress';
import { useGesture } from 'react-use-gesture';
import { IoTimerOutline } from 'react-icons/io5';
import { FiCamera } from 'react-icons/fi';
import RichTooltip from '../../Dashboard/Components/MultUsage/RichTooltip';

import {
  ProgressBar,
  BottomCrontols,
  MarkLast,
  ControlsWrapper,
  SoundFill,
  SoundView,
  SoundColumn,
  IconCog,
  PlayView,
  ProgressView,
  TooltipSpan,
  TooltipMouseSpan,
  ProgressInput,
  ProgressContainer,
} from './style';
import styled from 'styled-components';

const ItemQualityText = styled.p`
  color: ${({ selected, theme }) =>
    selected ? theme.palette.primary.light : 'inherent'};
  font-size: ${({ auto }) => (auto ? '1.4rem' : 'inherent')};
`;

const ButtonRate = styled.div`
  color: #fff;
  margin: 6px;
  font-weight: 600;
  cursor: pointer;

  &:first-child {
    margin-top: 12px;
  }

  &:last-child {
    margin-bottom: 12px;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.primary.light};
  }

  p {
    text-align: center;
    font-size: 15px;
  }

  span {
    font-size: 10px;
    margin-left: 1px;
  }
`;

const ButtonPlayRate = styled.div`
  color: #fff;
  margin: 0 14px 0 10px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.palette.primary.light};
  }

  p {
    text-align: center;
    font-size: 15px;
  }

  span {
    font-size: 10px;
    margin-left: 1px;
  }
`;

//https://www.youtube.com/watch?v=Y-OLcnr8eNo&list=PL4OKShK9gkQca9QVqmnPMzT6QYM2LHaqt&index=8

const Controls = forwardRef(
  (
    {
      progressRef,
      progressTimeRef,
      progressLoadRef,
      progressMark,
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
      hideMark,
      onQualityChange,
      quality,
    },
    ref,
  ) => {
    const anchorRef = React.useRef(null);
    const anchorQualityRef = React.useRef(null);
    const [openQuality, setOpenQuality] = React.useState(false);
    const [openRate, setOpenRate] = React.useState(false);
    const progressMouseRef = useRef(null);
    const soundRef = useRef(null);
    const { width, height, ref: resizeRef } = useResizeDetector();

    React.useEffect(() => {
      // console.log('totalDuration',totalDuration)
      // if (totalDuration) progressTimeRef.current.style.transform = totalDuration
      // const getProgress = progress ? progress.percentage : 0
      console.log('useResizeDetector');
      progressMark.current.style.transform = `translateX(${
        progressMark.current.value * progressRef.current.offsetWidth
      }px)`;
      progressTimeRef.current.style.transform = `translateX(${
        (progressRef.current.value / 400) * progressRef.current.offsetWidth
      }px)`;
    }, [width]);

    React.useEffect(() => {
      if (muted) {
        onSetSound(0.01);
      } else {
        onSetSound(volume - 0.01);
      }
    }, [volume, muted]);

    const handleProgressChange = (e) => {
      // console.log(parseFloat(e.target.value/400))
      if (progressMark.current.value < e.target.value / 400 && !hideMark) {
        return null;
      }
      console.log('ok');
      playerRef.current.seekTo(parseFloat(e.target.value / 400), 'fraction');
      progressTimeRef.current.style.transform = `translateX(${
        (e.target.value / 400) * progressRef.current.offsetWidth
      }px)`;
    };

    const handleMouseMove = (e) => {
      const widthProgress = progressRef.current.offsetWidth;
      const offSet = e.nativeEvent.offsetX;

      const TIME =
        playerRef && playerRef.current
          ? format((playerRef.current.getDuration() * offSet) / widthProgress)
          : '00:00';

      if (offSet >= 0 && offSet <= widthProgress) {
        progressMouseRef.current.innerText = TIME;
        progressMouseRef.current.style.opacity = '0.9';
        progressMouseRef.current.style.transform = `translateX(${offSet}px)`;
      }
    };

    const hanldeMouseLeave = () => {
      progressMouseRef.current.style.opacity = '0';
    };

    function onSetSound(percentage) {
      const first = soundRef.current.children[0];
      const second = soundRef.current.children[1];
      const third = soundRef.current.children[2];
      const fourth = soundRef.current.children[3];
      const five = soundRef.current.children[4];

      const x = percentage * 23;

      if (x < 0) first.children[0].style.transform = `translateX(-${3}px)`;
      if (x > 0 && x < 3)
        first.children[0].style.transform = `translateX(-${3 - x}px)`;
      if (x > 3) first.children[0].style.transform = `translateX(-${0}px)`;

      if (x < 5) second.children[0].style.transform = `translateX(-${3}px)`;
      if (x > 5 && x < 8)
        second.children[0].style.transform = `translateX(-${3 - x + 5}px)`;
      if (x > 8) second.children[0].style.transform = `translateX(-${0}px)`;

      if (x < 10) third.children[0].style.transform = `translateX(-${3}px)`;
      if (x > 10 && x < 13)
        third.children[0].style.transform = `translateX(-${3 - x + 10}px)`;
      if (x > 13) third.children[0].style.transform = `translateX(-${0}px)`;

      if (x < 15) fourth.children[0].style.transform = `translateX(-${3}px)`;
      if (x > 15 && x < 18)
        fourth.children[0].style.transform = `translateX(-${3 - x + 15}px)`;
      if (x > 18) fourth.children[0].style.transform = `translateX(-${0}px)`;

      if (x < 20) five.children[0].style.transform = `translateX(-${3}px)`;
      if (x > 20 && x < 23)
        five.children[0].style.transform = `translateX(-${3 - x + 20}px)`;
      if (x > 23) five.children[0].style.transform = `translateX(-${0}px)`;
    }

    const bind = useGesture({
      onDragStart: () => {
        soundRef.current.style.cursor = 'grabbing';
      },
      onDrag: ({ event, down }) => {
        const rect = soundRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;

        const first = soundRef.current.children[0];
        const second = soundRef.current.children[1];
        const third = soundRef.current.children[2];
        const fourth = soundRef.current.children[3];
        const five = soundRef.current.children[4];

        if (x > 0 && x < 3) {
          first.children[0].style.height = `${12 * 0.2 + 4}px`;
        } else {
          first.children[0].style.height = null;
        }

        if (x > 5 && x < 8) {
          second.children[0].style.height = `${12 * 0.4 + 4}px`;
        } else {
          second.children[0].style.height = null;
        }

        if (x > 10 && x < 13) {
          third.children[0].style.height = `${12 * 0.6 + 4}px`;
        } else {
          third.children[0].style.height = null;
        }

        if (x > 15 && x < 18) {
          fourth.children[0].style.height = `${12 * 0.8 + 4}px`;
        } else {
          fourth.children[0].style.height = null;
        }

        if (x > 20 && x < 23) {
          five.children[0].style.height = `${12 + 4}px`;
        } else {
          five.children[0].style.height = null;
        }

        onSetSound(x / 23);
      },
      onDragEnd: ({ event }) => {
        const rect = soundRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;

        onVolumeChange(x / 23);

        soundRef.current.style.cursor = 'pointer';
        soundRef.current.children[0].children[0].style.height = null;
        soundRef.current.children[1].children[0].style.height = null;
        soundRef.current.children[2].children[0].style.height = null;
        soundRef.current.children[3].children[0].style.height = null;
        soundRef.current.children[4].children[0].style.height = null;
      },
    });

    return (
      <ControlsWrapper ref={ref}>
        <img
          style={{
            width: 100,
            resize: 'cover',
            margin: 25,
            alignSelf: 'flex-end',
          }}
          src="/images/logoRealiza.png"
          alt="logo"
        />

        <div
          style={{ display: 'flex', flex: 1 }}
          onDoubleClick={onToggleFullScreen}
          onClick={onPlayPause}
        />
        <BottomCrontols onClick={() => {}}>
          <PlayView onDoubleClick={onToggleFullScreen} onClick={onPlayPause}>
            {playing ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </PlayView>
          <ProgressView>
            <ProgressContainer ref={resizeRef}>
              <TooltipMouseSpan ref={progressMouseRef}>00:00</TooltipMouseSpan>
              <TooltipSpan ref={progressTimeRef}>00:00</TooltipSpan>
              <MarkLast hideMark={hideMark} ref={progressMark} />
              <ProgressBar ref={progressLoadRef} />
              <ProgressInput
                style={{ margin: 0, padding: 0 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={hanldeMouseLeave}
                onChange={handleProgressChange}
                defaultValue={0}
                ref={progressRef}
                type="range"
                min="1"
                max="400"
              />
            </ProgressContainer>
            <SoundView ref={soundRef} {...bind()}>
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((item) => {
                return (
                  <SoundColumn key={item} percentage={item}>
                    <SoundFill item={item} />
                  </SoundColumn>
                );
              })}
            </SoundView>
            {/* <AccessTimeSharpIcon onClick={()=>{}} style={{fontSize:19,margin:'0 10px 0 5px'}}/> */}
            <div
              style={{ alignItems: 'center', display: 'flex' }}
              ref={anchorQualityRef}
            >
              <IconCog
                onClick={() => setOpenQuality(true)}
                style={{ fontSize: 18 }}
                rotatecog="true"
              />
            </div>

            <ButtonPlayRate ref={anchorRef} onClick={() => setOpenRate(true)}>
              <p>
                {Math.round(playbackRate * 100) / 100}
                <span>X</span>
              </p>
            </ButtonPlayRate>
            <FullScreen onClick={onToggleFullScreen} />
          </ProgressView>
        </BottomCrontols>

        <RichTooltip
          disablePortal
          placement={'top'}
          background={'darkModal'}
          translateY={-5}
          anchorRef={anchorRef}
          width={80}
          open={openRate}
          setOpen={setOpenRate}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[0.25, 0.5, 0.75, 'normal', 1.25, 1.5, 1.75, 2].map((rate) => (
              <ButtonRate
                key={rate}
                onClick={() => {
                  onPlaybackRateChange(rate == 'normal' ? 1 : rate);
                  setOpenQuality(false);
                }}
              >
                <p>
                  {rate}
                  {rate !== 'normal' && <span>X</span>}
                </p>
              </ButtonRate>
            ))}
          </div>
        </RichTooltip>

        <RichTooltip
          disablePortal
          placement={'top'}
          background={'darkModal'}
          translateY={-5}
          anchorRef={anchorQualityRef}
          width={80}
          open={openQuality}
          setOpen={setOpenQuality}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {['auto', '1080p', '720p', '540p', '360p'].map((value) => (
              <ButtonRate
                key={value}
                onClick={() => {
                  onQualityChange(value);
                  setOpenRate(false);
                }}
              >
                <ItemQualityText
                  auto={value === 'auto'}
                  selected={value === quality}
                >
                  {value}
                </ItemQualityText>
              </ButtonRate>
            ))}
          </div>
        </RichTooltip>
      </ControlsWrapper>
    );
  },
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

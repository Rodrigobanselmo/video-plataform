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
import Popover from "@material-ui/core/Popover";
import screenful from "screenfull";
import Controls from "./controls";
import {BottomControls} from "./bottomBar";
import useKeypress from 'react-use-keypress';
import Fade from '@material-ui/core/Fade';
import styled, {css} from "styled-components";
import CircularProgress from '@material-ui/core/CircularProgress';
import {isLocked} from './func'
import { useSelector,useDispatch, useStore } from 'react-redux'

import FullScreen from "@material-ui/icons/Fullscreen";
import { useParams,useHistory } from 'react-router-dom';
import { useNotification } from "../../context/NotificationContext";
import { useUpdateCurso } from "../../services/hooks/set/useUpdateCurso";
import { queryClient } from "../../services/queryClient";
import { VIDEO_ROUTE } from "../../routes/routesNames";
import { TestView } from "./testView";
import { CertificadoView } from "./certificadoView";
import { useAuth } from "../../context/AuthContext";

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
    background-color:#00000022;
    /* height:100%; */
    border-radius:10px 10px 0 0;
    overflow:hidden;
    position: relative;
    border:1px solid #00000022;
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
let save = 0;

const initialState = {
  pip: false,
  playing: true,
  controls: false,
  light: false,
  quality: 'auto',
  muted: false,
  played: 0,
  duration: 0,
  volume: 1,
  loop: false,
  seeking: false,
  qualityChanged: false,
  ready: false,
  isWaitingFirstPLay: true,
}
//setState({...initialState});

export function VideoPlayer({curso}) {
  // const [showControls, setShowControls] = useState(false);
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
  const {currentUser} = useAuth();
  const { cursoId,moduleId,classId } = useParams();

  const [autoplay, setAutoplay] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = useState({...initialState});
  const [playbackRate, setPlaybackRate] = useState(1);
  const queryModules =  queryClient.getQueryData(['student', cursoId, currentUser.uid]);
  const modules =  (queryModules && queryModules?.student) ? queryModules.student[0] : {}; //student

  // const progress = useSelector(state => state.progress)
  const store = useStore()
  const progress = store.getState().progress

  const refProgress = useRef(null);

  const notification = useNotification();
  const history = useHistory()
  const dispatch = useDispatch()
  const mutation = useUpdateCurso(cursoId)
  const pathname = VIDEO_ROUTE + '/' +cursoId

  const moduleIndex = moduleId ? curso.modules.findIndex(i=>i.id==moduleId) : 0;
  const classIndex = classId ? curso.modules[moduleIndex!==-1?moduleIndex:0].classes.findIndex(i=>i.id==classId) : 0;
  const actualClass = curso.modules[moduleIndex!==-1?moduleIndex:0].classes[classIndex!==-1?classIndex:0];

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const progressRef = useRef(null);
  const progressTimeRef = useRef(null);
  const progressLoadRef = useRef(null);
  const progressMark = useRef(null);
  const {
    playing,
    controls,
    quality,
    light,
    muted,
    loop,
    pip,
    played,
    qualityChanged,
    seeking,
    ready,
    isWaitingFirstPLay,
    volume,
  } = state;

  const percentage = modules[`${cursoId}//${moduleId}//${classId}`] && modules[`${cursoId}//${moduleId}//${classId}`]?.percentage
    ? modules[`${cursoId}//${moduleId}//${classId}`]?.percentage
    : 0

  const duration = playerRef && playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const currentTime = playerRef && playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const elapsedTime = format(currentTime)

  const totalDuration = format(duration);


  const isLastClass = curso.modules[moduleIndex] && curso.modules[moduleIndex].classes && classIndex == curso.modules[moduleIndex].classes.length - 1

  const nextModuleIndex = isLastClass
    ? moduleIndex+1
    : moduleIndex;

  const nextClassIndex = isLastClass
    ? 0
    : classIndex+1;

  const nextModule = curso.modules[nextModuleIndex]
  const nextClass = nextModule ? nextModule.classes[nextClassIndex] : 'lastModule'

  useEffect(() => {

    setState({...state,ready:false,playing:false});
    console.log('rate1')
    setPlaybackRate(1.005)
    const time = setTimeout(() => {
      setPlaybackRate(playbackRate)
      console.log('rate')
    }, 1000);
    refProgress.current = progress
    return ()=>clearTimeout(time)
  }, [moduleId,classId])

  const onReady = () => {

    if (!ready) {
      if (progress[`${cursoId}//${moduleId}//${classId}`] && percentage<100) {
        const setProgress = progress[`${cursoId}//${moduleId}//${classId}`];
        playerRef.current.seekTo(setProgress.percentage,'fraction');
        progressTimeRef.current.innerText = format(setProgress.seconds)
        progressTimeRef.current.style.transform = `translateX(${setProgress.percentage*progressRef.current.offsetWidth}px)`
        progressRef.current.value = `${setProgress.percentage*100*4}`
        progressMark.current.style.transform = `translateX(${setProgress.percentage*progressRef.current.offsetWidth}px)`

        const newState = {
          duration:totalDuration,
          ready:true,
          playing: autoplay?true:playing,
        }

        setState({
          ...state,
          ...newState,
        });
        //
        // if (progress && progress[`${cursoId}//${moduleId}//${classId}`] && progress[`${cursoId}//${moduleId}//${classId}`].percentage)
          // progressMark.current.style.transform = `translateX(${progress[`${cursoId}//${moduleId}//${classId}`].percentage*progressRef.current.offsetWidth}px)`
        // return setLoading(true)
      } else {
        setState({ ...state, duration:totalDuration,ready:true, playing: autoplay?true:playing });
        progressMark.current.style.transform = `translateX(0px)`
        progressTimeRef.current.innerText = format(playerRef.current.getDuration())
      }
    }

    setLoading(false)
  };

  const handlePlayPause = () => {
    // if (state.playing) controlsRef.current.style.opacity = 1
    console.log('pause',playerRef.current.getCurrentTime())
    // if (!state.playing && playerRef.current.getCurrentTime()>1) playerRef.current.seekTo(playerRef.current.getCurrentTime());
    // else if (!state.playing && playerRef.current.getCurrentTime()<1) playerRef.current.seekTo(0);
    const setProgress = progress[`${cursoId}//${moduleId}//${classId}`];
    if (isWaitingFirstPLay && setProgress) {
      playerRef.current.seekTo(setProgress.percentage,'fraction');
    }

    setState({ ...state, playing: !state.playing,isWaitingFirstPLay:false, qualityChanged:false });
    // setState({ ...state, isWaitingFirstPLay:false });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5);
  };

  const handleProgress = (changeState) => {
    if (count > 8) {
      controlsRef.current.style.opacity = 0;
      controlsRef.current.style.cursor = 'none';
      count = 0;
    }

    if (controlsRef.current.style.opacity == 1) {
      count += 1;
    }



    const pgr = refProgress.current[`${cursoId}//${moduleId}//${classId}`] ? refProgress.current[`${cursoId}//${moduleId}//${classId}`].seconds : 0

    if (qualityChanged) {
      handlePlayPause()
    }
    if (isWaitingFirstPLay) return
    console.log('ready')
    if (Math.floor(changeState.playedSeconds) % 5 == 0 && save == 0 && Math.floor(changeState.playedSeconds) > pgr && percentage<100) {

      console.log('SAVED')
      save = 1;

      const data = {
        [`${cursoId}//${moduleId}//${classId}`]:{
          seconds:Math.floor(changeState.playedSeconds),
          percentage:changeState.played,
        }
      }
      refProgress.current = {...refProgress.current,...data}
      dispatch({ type: 'PROGRESS_UPDATE', payload: data }) //PROGRESS_DISPATCH
    } else {
      save = 0;
    }

    if (!state.seeking) {
      const TIME = playerRef && playerRef.current ? format(playerRef.current.getCurrentTime()) : format(playerRef.current.getDuration());
      if (changeState.played>0) progressTimeRef.current.innerText = TIME
      progressTimeRef.current.style.transform = `translateX(${changeState.played*progressRef.current.offsetWidth}px)`
      progressRef.current.value = `${changeState.played*100*4}`
      progressLoadRef.current.style.width = `${changeState.loaded*100}%`

      const translate = progressMark.current.style.transform.replace('translateX(','').replace('px)','')
      if (translate <= changeState.played*progressRef.current.offsetWidth || !translate) {
        progressMark.current.style.transform = `translateX(${changeState.played*progressRef.current.offsetWidth}px)`
        progressMark.current.value = `${changeState.played}`
      }
    }
  };

  const handleSeekChange = (e, newValue) => {
    console.log(progressMark.current.value,newValue,percentage)
    if (progressMark.current.value*100 < newValue && percentage != 100) return null;
    playerRef.current.seekTo(parseFloat(newValue / 400),'fraction');
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    console.log(progressMark.current.value,newValue,percentage)
    setState({ ...state, seeking: false });
    if (progressMark.current.value*100 < newValue  && percentage != 100) return null;
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
    if (controlsRef.current) controlsRef.current.style.opacity = "1";
    if (controlsRef.current) controlsRef.current.style.cursor = 'default';
    count = 0;
  };

  const hanldeMouseLeave = () => {
    if (!state.playing) return
    controlsRef.current.style.opacity = "0";
    count = 0;
  };

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
  };

  const onQualityChange = (quality) => {
    setState({ ...state, quality,isWaitingFirstPLay:true,ready:false,qualityChanged:true });
  };

  const handlePreviewVideo = () => {

    if (moduleId == 'certificado') {

      const oldModuleIndex = curso.modules.length - 1
      const oldClassIndex = curso.modules[oldModuleIndex].classes.length-1

      const oldModule = curso.modules[oldModuleIndex]
      const oldClass = curso.modules[oldModuleIndex].classes[oldClassIndex]
      handleMouseMove()
      history.push(pathname+'/'+oldModule.id+'/'+oldClass.id)
      return
    }
    if (classIndex==0 && moduleIndex == 0) return null
    const isFirstClass = classIndex == 0;

    const oldModuleIndex = isFirstClass
      ? moduleIndex-1
      : moduleIndex;

    const oldClassIndex = isFirstClass
      ? curso.modules[oldModuleIndex].classes.length-1
      : classIndex-1;

    const oldModule = curso.modules[oldModuleIndex]
    const oldClass = curso.modules[oldModuleIndex].classes[oldClassIndex]

    const lock = isLocked(modules,oldClass,oldModuleIndex,oldClassIndex)
    if (lock !== 'ok') return notification.warn({message:lock})

    // setState({ ...state, playing: true });
    handleMouseMove()
    history.push(pathname+'/'+oldModule.id+'/'+oldClass.id)
  };

  const handleNextVideo = (next) => {

    const lock = isLocked(modules,nextClass,nextModuleIndex,nextClassIndex)
    if (lock === 'lastModule') {
      history.push(pathname+'/'+ 'certificado')
      return
      // return notification.success({message:'Você não possui mais aulas'})
    }
    if (moduleId == 'certificado') {

      const oldModuleIndex = curso.modules.length - 1
      const oldClassIndex = curso.modules[oldModuleIndex].classes.length-1

      const oldModule = curso.modules[oldModuleIndex]
      const oldClass = curso.modules[oldModuleIndex].classes[oldClassIndex]
      handleMouseMove()
      history.push(pathname+'/'+oldModule.id+'/'+oldClass.id)
      return
    }
    if (lock !== 'ok' && next != 'endNext') return notification.warn({message:lock})

    handleMouseMove()
    // setState({ ...state, playing: true });
    history.push(pathname+'/'+nextModule.id+'/'+nextClass.id)
  };

  const onEndVideo = async () => {
    // if (autoplay) {
    //   handleNextVideo('endNext')
    //   setLoading(true)
    // } else {
    //   handleMouseMove()
    //   handlePlayPause()
    // }
    // if ((
    //     modules[`${cursoId}//${moduleId}//${classId}`]
    //   &&
    //     modules[`${cursoId}//${moduleId}//${classId}`]?.percentage == 100
    //   )
    //   ||
    //   (
    //     modules[moduleId]
    //   &&
    //     modules[moduleId].includes(moduleId)
    //   )
    // ) return null

    await mutation.mutateAsync({cursoId,moduleId,classId,nextModule,nextClass,classIndex:nextClassIndex,moduleIndex:nextModuleIndex})
    // dispatch({ type: 'PROGRESS_DONE', payload: `${cursoId}//${moduleId}//${classId}` }) //PROGRESS_DISPATCH

    // dispatch({ type: 'MODULE_DONE', payload: {cursoId,moduleId,classId,nextModule,nextClass,classIndex:nextClassIndex,moduleIndex:nextModuleIndex} }) //PROGRESS_DISPATCH
  };

  useKeypress([' ','r','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'], (e) => {
    console.log('e.key',e.key)
    if (e.key === ' ') {
      handlePlayPause();
    } else if  (e.key === 'ArrowLeft') {
      // handleRewind()
      onEndVideo() // !remover
    } else if  (e.key === 'ArrowRight') {
      // handleFastForward()
    } else if  (e.key === 'ArrowUp') {
      if (volume<1) handleVolumeChange(volume+0.2)
      console.log(volume)
    } else if  (e.key === 'ArrowDown') {
      if (volume>0) handleVolumeChange(volume-0.2)
    } else if  (e.key === 'r') { // !remover
      const resetData = {
        uid: modules.uid,
        id: modules.id,
        status: 'started',
        percentage: 0,
        startDate: modules.startDate,
        expireDate: modules.expireDate,
        finishedDate: false,
        cursoId: modules.cursoId,
        modules: 'all',
        watched: {},
        classes:  modules.classes,
        position: '0/0',
        totalWatched: 0,
        numOfClasses: modules.numOfClasses,
      }
      mutation.mutateAsync(resetData,modules)
      console.log('r')
    }
    // Do something when the user has pressed the Escape key
  });

  return (
        <div style={{width:'100%'}}>
          {moduleId === 'certificado'?
            <>
              <PlayerWrapper>
                <CertificadoView
                  student={modules}
                  curso={curso}
                />
              </PlayerWrapper>
              <BottomControls
                autoplay={autoplay}
                setAutoplay={setAutoplay}
                handleNextVideo={handleNextVideo}
                handlePreviewVideo={handlePreviewVideo}
              />
            </>
          : actualClass?.type === 'test' ?
              <>
                <PlayerWrapper>
                  <TestView
                    actualClass={actualClass}
                    student={modules}
                    nextModule={nextModule}
                    nextClass={nextClass}
                    classIndex={nextClassIndex}
                    moduleIndex={nextModuleIndex}
                  />
                </PlayerWrapper>
                <BottomControls
                  autoplay={autoplay}
                  setAutoplay={setAutoplay}
                  handleNextVideo={handleNextVideo}
                  handlePreviewVideo={handlePreviewVideo}
                />
              </>
          :
            <>
              <PlayerWrapper
                onMouseMove={handleMouseMove}
                onMouseLeave={hanldeMouseLeave}
                ref={playerContainerRef}
              >
                <ReactPlayerStyles
                  ref={playerRef}
                  key={quality}
                  width="100%"
                  height="100%"
                  url={actualClass.video}
                  // url={'https://vimeo.com/584492307'}
                  config={{
                    vimeo: {
                      playerOptions:{
                        quality,
                      }
                    },
                  }}
                  // url={'https://www.youtube.com/watch?v=jhZf_nZ6XA4&ab_channel=PrometalEPIs'}
                  // url={'https://r1---sn-bg07dn6d.c.drive.google.com/videoplayback?expire=1624723013&ei=BRbXYLKMD4S3lAPknYOYCw&ip=2804:14d:4c85:9883:4990:24b8:c43f:2c1c&cp=QVRHVkhfUlBPRFhPOkdtd2VKMXpmcTN4YUFYQzN0SGlvRzN3RjRQNUtwdldEUU5Fak05WmpjbHU&id=c54e7706caaab4d4&itag=22&source=webdrive&requiressl=yes&mh=Ax&mm=32&mn=sn-bg07dn6d&ms=su&mv=u&mvi=1&pl=48&sc=yes&ttl=transient&susc=dr&driveid=1SFAJoeJKridToyArhRRFZRgXLoWVvaWJ&app=explorer&mime=video/mp4&vprv=1&prv=1&dur=83.150&lmt=1624030804692744&mt=1624707969&sparams=expire,ei,ip,cp,id,itag,source,requiressl,ttl,susc,driveid,app,mime,vprv,prv,dur,lmt&sig=AOq0QJ8wRQIgOkuCgdPAbrSXI0E-WoJwgN_G_elXyOsWoowB9Jiy57QCIQCWc5GcuwenzzyuTUlsgxnqgKqtQuZYBG289eQF2qAgFg==&lsparams=mh,mm,mn,ms,mv,mvi,pl,sc&lsig=AG3C_xAwRgIhAJLvChJuYSP1kdBGLAX7ScrdQP5zyu4XxuK2VshtwGZrAiEA3DHMMQvK0LHDHZR-tJK8OatQGbtZofCbDhV3v877n8Q=&cpn=tfzlDZRWu1Tf0r1p&c=WEB_EMBEDDED_PLAYER&cver=1.20210623.1.0'}
                  // url={'https://www.youtube.com/watch?v=N2OG1w6bGFo&ab_channel=GoogleCloudTech'}
                  pip={pip}
                  playing={playing}
                  controls={false}
                  light={light}
                  loop={loop}
                  playbackRate={playbackRate}
                  volume={volume}
                  muted={muted}
                  onBuffer={()=>setLoading(true)}
                  onBufferEnd={()=>setLoading(false)}
                  progressInterval={250}
                  onProgress={handleProgress}
                  onReady={onReady}
                  onEnded={onEndVideo}
                  // config={{
                  //   youtube: {
                  //     playerVars: { start:100 }
                  //   },
                  // }}
                />
                {loading&&<CircularProgress style={{position:'absolute',top:'calc(50% - 40px)',left:'calc(50% - 30px)'}} size={60}/>}
                <Controls
                  ref={controlsRef}
                  hideMark={percentage == 100}
                  // progress={progress[`${cursoId}//${moduleId}//${classId}`]}
                  progressRef={progressRef}
                  progressTimeRef={progressTimeRef}
                  progressLoadRef={progressLoadRef}
                  progressMark={progressMark}
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
                  onQualityChange={onQualityChange}
                  quality={quality}
                  volume={volume}

                />
              </PlayerWrapper>
              <BottomControls
                autoplay={autoplay}
                setAutoplay={setAutoplay}
                handleNextVideo={handleNextVideo}
                handlePreviewVideo={handlePreviewVideo}
              />
            </>
          }
        </div>
  );
}



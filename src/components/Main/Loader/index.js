import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LoadFullScreen, LoadDashboard } from './Loader.js';
import LottieAnimation from '../../../lib/lottie';
import {useLoaderDashboard} from '../../../context/LoadDashContext'

const SlideUp = keyframes`
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(15px);
    }
    100% {
        transform: translateY(0px);
    }
`;

const Image = styled.img`
  height: 75px;
  resize:cover;
  animation: ${SlideUp} 1.5s;
  animation-iteration-count: infinite;
`;


export const LoaderSimple = ({ load = false }) => {
  return (
    <>
      {load && (
        <LoadFullScreen load={load}>
          <LottieAnimation
            lotti="loader"
            height={50}
            width={50}
            isClickToPauseDisabled
          />
        </LoadFullScreen>
      )}
    </>
  );
};

export const LoaderDashboard = ({ children, open = true }) => {
  const { loaderDash } = useLoaderDashboard();
  return (
    <>
      {loaderDash && (
        <LoadDashboard open={open}>
          <Image src="/images/logore.jpg" alt="logo" />
        </LoadDashboard>
      )}
      {children}
    </>
  );
};

import React, { useEffect, useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { useLoaderDashboard } from '../../../context/LoadDashContext';
//undraw_mobile_testing_reah
import { NormalizeData } from '../../../helpers/DataHandler';
import { onGetHomeData } from './func';
import styled, { css } from 'styled-components';
import Collapse from '@material-ui/core/Collapse';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { VideoPlayer } from '../../../components/VideoPlayer';
import { SideVideoBar } from '../../../components/VideoPlayer/sidebar';
import {
  Title,
  ContainerPlayer,
  SideVideoBarTry,
  ProgressContainer,
  Container,
  PercentageSpan,
  Shadow,
  ProgressWrapper,
  CircleView,
  ProgressBar,
} from './style';
import {
  CreateCursoData,
  GetCursoDataValidatePage,
  UpdateStudentProgress,
} from '../../../services/firestoreVideo';
import { useAuth } from '../../../context/AuthContext';
import { useHistory, useParams, useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { CURSOS, VIDEO_ROUTE } from '../../../routes/routesNames';
import { useCurso } from '../../../services/hooks/get/useCurso';
import { useUpdateCurso } from '../../../services/hooks/set/useUpdateCurso';
import { useStudent } from '../../../services/hooks/get/useStudent';
import { queryClient } from '../../../services/queryClient';
import { Comments } from '../../../components/Main/Comments';

export default function Video() {
  const { currentUser } = useAuth();
  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();
  const { cursoId } = useParams();

  // const  { data:curso, isLoading:cursoIsLoading } = useCurso({cursoId})
  const { data, isLoading } = useStudent({ cursoId });

  const cursoPrev = data?.curso;
  let curso = { ...cursoPrev };

  const student = data?.student;

  const uploadCursoMutation = useUpdateCurso(cursoId);

  const module = useSelector((state) => state.modules);
  const modules = student ? student[0] : {};
  const history = useHistory();

  const pathname = VIDEO_ROUTE + '/' + cursoId;

  return (
    <Container>
      {curso && student && student[0] && !isLoading ? (
        <>
          <Shadow>
            <Title>EPI</Title>
            <ProgressContainer></ProgressContainer>
            <ContainerPlayer>
              <VideoPlayer curso={curso} />

              <SideVideoBarTry>
                <SideVideoBar curso={curso} notLock />
              </SideVideoBarTry>
            </ContainerPlayer>
          </Shadow>
          <Shadow style={{ marginTop: 20 }}>
            <Comments curso={curso} />
          </Shadow>
        </>
      ) : null}
    </Container>
  );
}

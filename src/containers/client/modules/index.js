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

  function onSetRouteVideo(studentData, cursoData) {
    console.log('studentData', studentData);
    if (studentData.percentage === 1) {
      return history.replace(pathname + '/' + 'certificado');
    }

    if (studentData?.nextModule) {
      history.replace(
        pathname + '/' + studentData.nextModule + '/' + studentData.nextClass,
      );
    } else {
      history.replace(
        pathname +
          '/' +
          cursoData.modules[0].id +
          '/' +
          cursoData.modules[0].classes[0].id,
      );
    }
  }

  async function updateModules(cursoData, studentData) {
    //serve para ver qual estado (persisted ou database) esta mais atual
    console.log('modulemodule', module);
    //observa por mudanças nos epis durante o curso
    const watchCursos = currentUser?.cursos ?? [];
    const index = watchCursos.findIndex(
      (i) => i.id === cursoId && i?.status === 'started' && i?.epi,
    );

    // se curso existir e tiver em progresso verfico se numero/ids de epis é o mesmo
    if (index >= 0) {
      const epiArray = [];
      const isEqualEpis =
        watchCursos[index].epi
          .map((epi) => {
            epiArray.push(...epi.id.split('//'));
            return studentData.classes.includes(epi.id.split('//')[0]);
          })
          .filter((i) => !i).length == 0;
      if (!isEqualEpis) {
        const newStudent = { ...studentData };
        newStudent.numOfClasses =
          newStudent.numOfClasses + epiArray.length - newStudent.classes.length;
        newStudent.classes = epiArray;
        await uploadCursoMutation.mutateAsync(newStudent);
      }
    }

    if (
      module &&
      module[studentData.id] &&
      module[studentData.id]?.totalWatched &&
      module[studentData.id].totalWatched > studentData.totalWatched
    ) {
      onSetRouteVideo(module, cursoData);
      await uploadCursoMutation.mutateAsync(module[studentData.id]);
      console.log('update student'); // remove
    } else {
      onSetRouteVideo(studentData, cursoData);
    }
  }

  useEffect(() => {
    console.log('modules', modules);
    const isLoadFinished = !isLoading;
    const isStudent = curso && student && student.length > 0;
    console.log('student', student);
    const isExpired =
      isStudent &&
      student[0]?.expireDate &&
      student[0].expireDate < new Date().getTime();
    // const isExpired = isStudent && student[0]?.expireDate && student[0].expireDate > new Date().getTime()
    if (isExpired) {
      console.log('expired', student[0].expireDate, new Date().getTime());
      notification.error({
        message: 'Seu curso expirou, reinicie para obter seu certificado!',
      });
      return history.push(CURSOS);
    }

    if (isLoadFinished && isStudent) {
      updateModules(curso, student[0]); //se tiver tudo certo manda pra cá
      setLoaderDash(false);
    }

    if (isLoadFinished && !isStudent) {
      notification.error({
        message:
          'É necesário que você esteja cadastrado neste curso para continuar!',
      });
      return history.push(CURSOS);
    }
  }, [isLoading]);

  useEffect(() => {
    console.log('modules finished');
    if (modules?.percentage && modules?.percentage == 1)
      console.log('finished');
  }, [modules]);

  return (
    <Container>
      {curso && student && student[0] && !isLoading ? (
        <>
          <Shadow>
            <Title>EPI</Title>
            <ProgressContainer>
              <ProgressWrapper>
                <ProgressBar
                  style={{ width: `${modules.percentage * 100 || 0}%` }}
                />
              </ProgressWrapper>
              <PercentageSpan>
                {Math.round(modules.percentage * 100) || 0}%
              </PercentageSpan>
            </ProgressContainer>
            <ContainerPlayer>
              <VideoPlayer curso={curso} />

              <SideVideoBarTry>
                <SideVideoBar curso={curso} />
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

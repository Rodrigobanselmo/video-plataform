import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { ButtonForm } from '../../Dashboard/Components/Form/comp';
import { render } from 'react-dom';
import { TestModal } from '../../Modal/Pages/TesteModal';
import { useCountdown } from '../../../hooks/useCountdown';
import { useUpdateCurso } from '../../../services/hooks/set/useUpdateCurso';
import { useParams } from 'react-router';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { fade, lighten, darken } from '@material-ui/core/styles';
import { GiPartyPopper } from 'react-icons/gi';
import { Rating } from 'react-simple-star-rating';
import { db } from '../../../lib/firebase.prod.js';
import { useAuth } from '../../../context/AuthContext';
import { useDownloadCertification } from '../../../services/hooks/http/useDownloadCertification';
import { useHistory } from 'react-router-dom';
import { CURSOS } from '../../../routes/routesNames';

const TestWrapper = styled.div`
  /* position: absolute; */
  /* top:0; */
  /* left:0; */
  width: 100%;
  height: 100%;
  padding: 20px;
  margin-top: -56.25%;

  @media screen and (max-width: 700px) {
    margin-top: -56.25%;
    position: relative;
    width: 100%;
    height: fit-content;
  }
`;

const InfoWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: 10px 15px;
  border-radius: 10px;
  position: relative;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.text.primary};
    border-radius: 5px;
    opacity: 0.85;
  }
`;

const TitleView = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ theme }) => theme.palette.text.primary};
  gap: 10px;
  margin-bottom: 20px;

  h1 {
    opacity: 0.8;
  }
`;

const TextStars = styled.p`
  margin-bottom: 0.25rem;
  margin-top: 0.5rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: ${(props) => (props.type == 'font' ? '220px' : '100%')};
  resize: none;
  padding: 12px 8px 24px 8px;
  background-color: ${({ theme }) =>
    darken(theme.palette.background.paper, 0.01)};
  color: ${({ theme }) => theme.palette.background.secondary};
  box-sizing: border-box;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.palette.background.line};
  /* -webkit-box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.23);
  box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.23); */
  margin: 0 0 20px 0;
  border-radius: 6px;

  /* ${(props) =>
    props.error &&
    css`
      border: 1px solid ${({ theme }) => theme.palette.background.attention};
    `} */
`;

export function CertificadoView({ curso, student }) {
  // const { cursoId,moduleId,classId } = useParams();
  // const mutation = useUpdateCurso(cursoId)
  // const [open, setOpen] = useState(false)
  const { currentUser } = useAuth();
  const history = useHistory();
  const reviewsRef = db.collection('curso').doc(curso.id).collection('reviews');

  const [rating, setRating] = useState('0'); // initial rating value
  const [textValue, setTextValue] = useState(''); // initial rating value

  const downloadCertificate = useDownloadCertification();

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    // Some logic
  };

  function handleDownloadMaterial() {
    console.log('curso', curso);
    const url = curso?.material ? curso.material[1] : null;
    if (!url) return null;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('target', '_blank');

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
  }

  function handleDownloadCertificate() {
    downloadCertificate.mutateAsync({ certificationId: student.id });
  }

  const handleFinishedCourse = async () => {
    const data = {
      rating,
      text: textValue,
      id: currentUser.uid,
      studentId: student.id,
    };

    console.log(data, student);
    if (rating || textValue) {
      await reviewsRef.doc(currentUser.uid + '--' + student.id).set(data);
    }

    return history.push(CURSOS);
  };

  return (
    <TestWrapper>
      <TitleView>
        <h1>Parabéns</h1>
        {/* <GiPartyPopper style={{fontSize:30}}/> */}
      </TitleView>

      <InfoWrapper>
        <p>
          {' '}
          Parabens por ter finalizado o curso e muito obrigado por ter confiando
          em nós, Realiza, para ficarmo responsavel por seu aprendizado.
        </p>
        {curso?.accessTimeAfter ? (
          <p>
            Este curso ainda estará{' '}
            <b>
              disponivel para visualizar por mais {curso.accessTimeAfter} dias.
            </b>
          </p>
        ) : (
          ''
        )}
        <p>
          {' '}
          Seu certificado já foi enviado para ser assinado por nossos
          instrutores e avisaremos você por email quando estiver tudo certo. Seu
          certificado poderá também ser encontrado na parte inferior da área de
          cursos da plataforma.
        </p>
        {curso.cursoValidation ? (
          <p>
            O certificado deste curso é{' '}
            <b>
              válido por {curso.cursoValidation}{' '}
              {curso.cursoValidation == 1 ? 'mês' : 'meses'}
            </b>
          </p>
        ) : null}
      </InfoWrapper>
      <p>Ainda não baixou nosso material didatico?</p>
      <ButtonForm
        // loading={mutation.isLoading}
        onClick={handleDownloadMaterial}
        justify="flex-start"
        secondary="true"
        style={{ width: 'fit-content' }}
      >
        Baixar Material Didádico
      </ButtonForm>
      <TextStars>Avaliar curso:</TextStars>
      <Rating
        emptyColor="#ffffff"
        onClick={handleRating}
        ratingValue={rating}
      />
      <TextArea
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Descreva o motivo de sua nota"
      />
      <p>Qualquer dúvida entre em contato com nosso suporte</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonForm
          // loading={mutation.isLoading}
          onClick={handleDownloadCertificate}
          justify="flex-end"
          primary="outlined"
          loading={downloadCertificate.isLoading}
          style={{ flex: 100 }}
        >
          Baixar Certificado
        </ButtonForm>
        <ButtonForm
          // loading={mutation.isLoading}
          onClick={handleFinishedCourse}
          justify="flex-end"
          primary="true"
          style={{ width: '100px', marginLeft: '10px', flex: 0 }}
          width="fit-content"
        >
          Concluir
        </ButtonForm>
      </div>
    </TestWrapper>
  );
}

/* eslint-disable react/jsx-curly-newline */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect, useRef } from 'react';
// import Modal from './Modal'
import { useLocation, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import HelpIcon from '@material-ui/icons/Help';
import * as Yup from 'yup';
import { RawDraftContentState } from 'draft-js';
import { useDispatch, useSelector, useStore } from 'react-redux';
import HeaderProfile from '../../../../components/Dashboard/Components/Blocks/HeaderProfile';
import { useNotification } from '../../../../context/NotificationContext';
import { useAuth } from '../../../../context/AuthContext';
import { useLoaderScreen } from '../../../../context/LoaderContext';
import { useLoaderDashboard } from '../../../../context/LoadDashContext';
import { ProfilePrimaryUserData } from '../../../../components/Containers/Profile/ProfilePrimaryUserData';
import { ProfileHistory } from '../../../../components/Containers/Profile/ProfileHistory';
import { DraftWrite } from '../../../../components/Draft/DraftWrite';
import { HeaderComponent } from '../../../../components/Blocks/Header';
import { HeaderBlock } from '../../../../components/Molecules/HeaderBlock';
import { InputFile } from '../../../../components/Forms/components/InputFile';
import { InputUnform } from '../../../../components/Main/MuiHelpers/Input.js';
import { NumberOnly } from '../../../../lib/textMask';
import { CursoAddData } from '../../../../components/Forms/CursoAddData';
import { ButtonForm } from '../../../../components/Dashboard/Components/Form/comp';
import { keepOnlyNumbers } from '../../../../helpers/StringHandle';
import { ModalNormal } from '../../../../components/Modal/Modal';
import { ModalCreateCurso } from './modal';
import { InputImage } from '../../../../components/Forms/components/InputImage';
import { useCreateCurso } from '../../../../services/hooks/set/useCreateCurso';
import { onLater } from '../../../../helpers/DataHandler';
import { useUploadImage } from '../../../../services/hooks/set/useUploadImage';
import { ModuleData } from '../../../../components/Forms/ModuleData';
import { InputMaterial } from '../../../../components/Forms/components/InputMaterial';
import { useUploadFile } from '../../../../services/hooks/set/useUploadFile';
import { useDeleteCurso } from '../../../../services/hooks/del/useDeleteCurso';

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 100px 100px;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
`;

const BackButton = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 2rem;
  width: 70px;
  height: 70px;
  background-color: white;
  border-radius: 50px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  align-items: center;
  justify-content: center;
  border: none;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-weight: bold;
  font-size: 1rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

interface IDraft {
  text: RawDraftContentState;
  public: RawDraftContentState;
}

interface IUser {
  currentUser: {
    uid: string;
    name: string;
  };
}

const Team: React.FC = () => {
  const { currentUser }: IUser = useAuth();

  // const notification = useNotification()
  // const query = new URLSearchParams(useLocation().search)
  const store = useStore();
  const save = useSelector((state: any) => state.save);
  const history = useHistory();
  const { setLoaderDash } = useLoaderDashboard();
  const notification = useNotification();
  const dispatch = useDispatch();
  const mutation = useCreateCurso();
  const uploadImage = useUploadImage();
  const uploadFile = useUploadFile();
  const mutationDelete = useDeleteCurso();

  // const [draftPublic, setDraftPublic] = useState<RawDraftContentState | null>(
  //   null,
  // );
  // const [draftAbout, setDraftAbout] = useState<RawDraftContentState | null>(
  //   null,
  // );

  const refInputData = useRef({} as any);
  const [open, setOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>({});
  const [cursoData, setCursoData] = useState<any>({});
  const [imageURL, setImageURL] = useState('');
  const [materialURL, setMaterialURL] = useState<[name: string, url: string]>([
    '',
    '',
  ]);
  const [modules, setModules] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [subCursos, setSubCursos] = useState<any[]>([]);

  const handleOnClose = (close?: boolean, curso?: any): void => {
    if (close) {
      if (curso) setCursoData(curso);
      return setOpen(false);
    }
    if (curso) return setCursoData(curso);
    history.goBack();
    // notification.warn({
    //   message: 'Selecione um curso ou crie um novo para continuar.',
    // });
  };

  const onHandleSelectImage = async (file: File): Promise<void> => {
    console.log(file);
    // setImageURL()
    const URL = await uploadImage.mutateAsync({
      imageFile: file,
      ...cursoData.main,
    });
    setImageURL(URL);
    document.getElementById('onCursoSaveButton')?.click();
  };

  const onHandleSelectMaterial = async (file: File): Promise<void> => {
    console.log(file);
    // setImageURL()
    const URL = await uploadFile.mutateAsync({
      file,
      ...cursoData.main,
    });
    setMaterialURL([file.name, URL]);
    document.getElementById('onCursoSaveButton')?.click();
  };

  const handleSelectModules = (arrayModules: any[]): void => {
    setModules(arrayModules);
  };

  const handleDeleteCurso = async (): Promise<void> => {
    if (!cursoData?.main)
      return notification.warn({ message: 'Erro ao localizar curso' });

    if ('published' in cursoData.main && cursoData?.main.published !== 0)
      return notification.warn({
        message: 'Este Curso já foi publicado e não pode ser excluido',
      });

    await mutationDelete.mutateAsync(cursoData.main);
    setOpen(true);
  };

  const handleSelectCourse = ([curso, Draft]: [any, IDraft]): void => {
    console.log(`data curso create`, curso, Draft);
    if (Draft?.text) dispatch({ type: 'DRAFT_ABOUT', payload: Draft.text });
    if (Draft?.public)
      dispatch({ type: 'DRAFT_PUBLIC', payload: Draft.public });
    setInitialData({
      name: curso.name,
      daysToExpire: curso.daysToExpire,
      duration: curso.duration,
      accessTimeAfter: curso.accessTimeAfter,
      cursoValidation: curso.cursoValidation,
      validSignature: curso.validSignature,
      answerEmail: curso.answerEmail,
      certificationEmail: curso.certificationEmail,
    });
    setModules([...curso.modules]);
    setOpen(false);
    setCombos(curso?.combos || []);
    setSubCursos(curso?.subs || []);
    setCursoData({ main: curso, draft: { id: curso.id, editorState: true } });
  };

  useEffect(() => {
    setLoaderDash(false);
  }, []); // query,

  useEffect(() => {
    if (open) {
      setInitialData({});
      dispatch({ type: 'DRAFT_PUBLIC_RESET' });
      dispatch({ type: 'DRAFT_ABOUT_RESET' });
      dispatch({ type: 'SAVED' });
      setImageURL('');
      setModules([]);
      setCombos([]);
      setSubCursos([]);
      setMaterialURL(['', '']);
    }
  }, [open]); // query,

  const isPublished = cursoData?.main && cursoData?.main?.published;
  const image = imageURL || (cursoData?.main && cursoData?.main?.image);
  const material = materialURL[0]
    ? materialURL
    : (cursoData?.main && cursoData.main?.material) || materialURL;

  const onSubmit = async (event: any): Promise<void> => {
    event.preventDefault();
    console.log('refInputData.current', refInputData.current);
    const {
      accessTimeAfter: ata,
      daysToExpire: dte,
      duration: drt,
      cursoValidation: cv,
      answerEmail,
      certificationEmail,
      name,
      validSignature,
    } = refInputData.current;

    const daysToExpire = String(dte) ? keepOnlyNumbers(String(dte)) : '';
    const duration = String(drt) ? keepOnlyNumbers(String(drt)) : '';
    const accessTimeAfter = String(ata) ? keepOnlyNumbers(String(ata)) : '';
    const cursoValidation = String(cv) ? keepOnlyNumbers(String(cv)) : '';

    setSaving(true);
    await onLater(1000);
    const { draftPublic } = store.getState();
    const { draftAbout } = store.getState();

    if (!name) {
      setSaving(false);

      return notification.warn({
        message: 'Nome do curso não pode ser nulo.',
      });
    }
    if (!daysToExpire) {
      setSaving(false);
      return notification.warn({
        message: 'Dias até expirar não pode ser nulo.',
      });
    }
    if (!duration) {
      setSaving(false);
      return notification.warn({
        message: 'Duração não pode ser nulo.',
      });
    }
    if (!accessTimeAfter) {
      setSaving(false);
      return notification.warn({
        message: 'Dias de acesso após conslusão não pode ser nulo.',
      });
    }
    if (!cursoValidation) {
      setSaving(false);
      return notification.warn({
        message: 'Você deve informar se o curso possui validade.',
      });
    }
    if (!answerEmail) {
      setSaving(false);
      return notification.warn({
        message: 'Email de dúvidas não pode ser nulo.',
      });
    }
    if (validSignature && !certificationEmail) {
      setSaving(false);
      return notification.warn({
        message: 'Email de dúvidas não pode ser nulo.',
      });
    }

    if (!draftPublic) {
      setSaving(false);
      return notification.warn({
        message: 'O campo de público alvo não pode ser nulo.',
      });
    }

    if (!draftAbout) {
      setSaving(false);

      return notification.warn({
        message: 'O campo sobre o curso não pode ser nulo.',
      });
    }

    if (modules.length === 0) {
      setSaving(false);
      return notification.warn({
        message: 'Insira os módulos e aulas para salvar.',
      });
    }

    if (!image) {
      setSaving(false);
      return notification.warn({
        message: 'Insira uma imagem de capa do curso.',
      });
    }

    const newData = {
      main: {
        ...cursoData.main,
        name,
        modules,
        daysToExpire: Number(daysToExpire),
        duration: Number(duration),
        accessTimeAfter: Number(accessTimeAfter),
        cursoValidation: Number(cursoValidation),
        numOfModules: modules.length,
        validSignature,
        certificationEmail: validSignature ? certificationEmail : '',
        answerEmail,
        subCursos: modules.reduce((acc: number, item: any) => {
          let accumulator = acc;
          if (item?.classes)
            item.classes.map((i: any) => {
              if (i?.epi) accumulator += 1;
              // * if (!(i?.type && i.type === 'test') && i?.epi) accumulator += 1;
            });
          return accumulator;
        }, 0),
        numOfClasses: modules.reduce((acc: number, item: any) => {
          let accumulator = acc;
          if (item?.classes)
            item.classes.map((i: any) => {
              if (!i?.epi) accumulator += 1;
              // * if (!(i?.type && i.type === 'test') && !i?.epi) accumulator += 1;
            });
          return accumulator;
        }, 0),
      },
      draft: {
        ...cursoData.draft,
        text: draftAbout,
        public: draftPublic,
      },
    };
    if (combos && Array.isArray(combos) && combos.length > 0)
      newData.main.combos = combos;
    if (subCursos && Array.isArray(subCursos) && subCursos.length > 0)
      newData.main.subs = subCursos;
    if (materialURL && materialURL[0] && materialURL[1])
      newData.main.material = materialURL;
    if (imageURL) newData.main.image = imageURL;
    if (!save) {
      if (
        modules.some((md) => {
          console.log(`md.classes`, md.classes);
          if (!md?.classes) return true;
          return md.classes.some((cl: any) => !cl?.video && !cl?.type);
        })
      ) {
        setSaving(false);
        return notification.warn({
          message: 'Insira a url dos videos nos modulos para publicar.',
        });
      }
      delete newData.draft;
      newData.main.published = !isPublished;
      const newCursoData = await mutation.mutateAsync(newData);
      setCursoData(newCursoData);
      setSaving(false);
    } else {
      const newCursoData = await mutation.mutateAsync(newData);
      setCursoData(newCursoData);
      dispatch({ type: 'SAVED' });
      setSaving(false);
    }
  };

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <HeaderComponent
          title="Cadastrar Novo Curso"
          subTitle={['admin', 'cursos', 'created']}
          icon={<ScreenShareIcon />}
          video
        />
        <InputImage imageURL={image} onHandleSelect={onHandleSelectImage} />
        <ButtonsContainer>
          <ButtonForm
            style={{ marginBottom: '10px', minWidth: 100 }}
            primary="outlined"
            type="button"
            loading={mutationDelete.isLoading}
            onClick={handleDeleteCurso}
            // justify="right"
          >
            Deletar
          </ButtonForm>
          <ButtonForm
            style={{ marginBottom: '10px', minWidth: 100 }}
            primary
            type="submit"
            loading={false}
            disabled={save || mutationDelete.isLoading}
            // justify="right"
          >
            {isPublished ? 'Despublicar' : 'Publicar'}
          </ButtonForm>
          <ButtonForm
            id="onCursoSaveButton"
            style={{ marginBottom: '10px', minWidth: 100 }}
            primary
            type="submit"
            loading={saving}
            disabled={!save || mutationDelete.isLoading}
            // justify="right"
          >
            Salvar
          </ButtonForm>
        </ButtonsContainer>
        <CursoAddData initialData={initialData} refInputData={refInputData} />
        <InputMaterial
          materialURL={material}
          onHandleSelect={onHandleSelectMaterial}
          isLoading={uploadFile.isLoading}
        />
        {modules.length === 0 ? (
          <InputFile handleSelectModules={handleSelectModules} />
        ) : (
          <ModuleData
            modules={modules}
            setModules={setModules}
            setCombos={setCombos}
            combos={combos}
            subCursos={subCursos}
            setSubCursos={setSubCursos}
          />
        )}
        {/* <div>
          <p>Módulo 1</p>
          <div>

          </div>
        </div> */}
        <HeaderBlock
          title="Público Alvo"
          text="Aqui você deve inserir quem é o público alvo do curso"
          mt={1}
        />
        <DraftWrite
          size="xs"
          // initialEditorState={draftPublic}
          onSave={(value) => {
            dispatch({ type: 'DRAFT_PUBLIC', payload: value });
          }}
          selector="draftPublic"
          restart={open}
          autoSave
        />
        <HeaderBlock
          title="Sobre o curso"
          text="Aqui você deve inserir as principais informações sobre o curso"
          mt={2}
        />
        <DraftWrite
          size="s"
          allVisible
          restart={open}
          // initialEditorState={draftAbout}
          onSave={(value) => {
            dispatch({ type: 'DRAFT_ABOUT', payload: value });
          }}
          selector="draftAbout"
          autoSave
        />
      </form>
      <ModalCreateCurso
        handleSelectCourse={handleSelectCourse}
        open={open}
        handleOnClose={handleOnClose}
      />
      <BackButton type="button" onClick={() => setOpen(true)}>
        Voltar
      </BackButton>
    </Container>
  );
};

export default Team;

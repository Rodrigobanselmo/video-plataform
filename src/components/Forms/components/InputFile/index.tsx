/* eslint-disable prettier/prettier */
/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import readXlsxFile from 'read-excel-file';
import { useNotification } from '../../../../context/NotificationContext';

const Text = styled.p`
  margin: 10px 0px 5px 0;
`;

const Input = styled.input`
  margin-right: auto;
  width: 100%;
  margin: 0px 10px 10px 0;
  padding: 20px;
  border: 2px dashed ${({ theme }) => theme.palette.background.line};
  border-radius: 10px;
`;

interface IInputProps {
  handleSelectModules: (value: any[]) => void;
}

interface FileResult {
  webkitRelativePath?: string;
}

interface IClasses {
  id: string;
  name: string;
  lock: string[];
  private: boolean;
}

interface IModule {
  id: string;
  name: string;
  classes: IClasses[];
}

type newFile = File & FileResult;

export const InputFile = ({
  handleSelectModules,
}: IInputProps): React.ReactElement => {
  const notification = useNotification();
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('directory', '');
      ref.current.setAttribute('webkitdirectory', '');
    }
  }, [ref]);

  const resolveExcelFile = async (file: newFile): Promise<{moduleData:any,questionsData:any}> => {
    const schema = {
      'About': {
        prop: 'module',
        type: {
          'Nome do teste': {
            prop: 'name',
            type: String,
          },
          'Tempo máximo em minutos': {
            prop: 'maxTime',
            type: Number,
          },
          'Porcentagem de acertos para passar': {
            prop: 'percentageToPass',
            type: String,
          },
        },
      },
      'QUESTIONS': {
        prop: 'question',
        type: {
          'texto': {
            prop: 'text',
            type: String,
            required: true,
          },
          'resposta': {
            prop: 'answer',
            type: String,
            required: true,
          },
          'explicação': {
            prop: 'why',
            type: String,
          },
          'options': {
            prop: 'options',
            type: {
              'a': {
                prop: 'a',
                type: String,
                required: true,
              },
              'b': {
                prop: 'b',
                type: String,
                required: true,
              },
              'c': {
                prop: 'c',
                type: String,
              },
              'd': {
                prop: 'd',
                type: String,
              },
              'e': {
                prop: 'e',
                type: String,
              },
            },
          },
        },
      },
    }
    const {rows, errors} = await readXlsxFile(file,{schema});
    console.log(errors,'errors')
    const moduleData = rows.find((i:any)=>i?.module).module
    const questionsData = rows.map((i:any)=>{
      return {
        text:i.question.text,
        answer:i.question.options[i.question.answer] || Object.values(i.question.options).find((fi:any)=>i.question?.answer && fi === i.question.answer),
        why:i.question?.why ? i.question?.why : '' ,
        id:v4(),
        options:Object.values(i.question.options).map((text:any)=>({text})).filter((t:any)=>t.text),
      }
    })
    return { moduleData, questionsData }
  };

  const onInputFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    const modules: IModule[] = [];

    try {
      if (e.target.files) {
        await Promise.all(Object.values(e.target.files).map(async(file: newFile): Promise<string> => {
          // eslint-disable-next-line prettier/prettier
          const isExcel = file.type && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          const isVideo = file.type && file.type.includes('video/');
          // return 'teste';
          if (!isVideo && !isExcel) return 'not a video file';
          if (file?.webkitRelativePath) {

            const slashFilePath = file.webkitRelativePath.split('/');
            if (slashFilePath.length !== 3) throw 'wrong_path';

            const moduleIndex = Number(slashFilePath[1].split('-')[0]) - 1;
            const moduleName = slashFilePath[1].split('-')[1];
            const courseIndex = Number(slashFilePath[2].split('-')[0]) - 1;
            const courseName = slashFilePath[2].split('-')[1].split('.');
            courseName.pop();

            if (slashFilePath[2].includes('~') || slashFilePath[2].includes('$')) return  'next'
            if (!(typeof moduleIndex === 'number') || !moduleName || !(typeof courseIndex === 'number') || !courseName) throw 'wrong_format';

            if (!modules[moduleIndex]) {
              modules[moduleIndex] = {
                classes: [],
                name: moduleName,
                id: v4(),
              };
            }
            if (!modules[moduleIndex].classes[courseIndex])
              modules[moduleIndex].classes[courseIndex] = {} as IClasses;
            modules[moduleIndex].classes[courseIndex].name = courseName.join(
              '',
            );
            modules[moduleIndex].classes[courseIndex].id = v4();
            modules[moduleIndex].classes[courseIndex].lock = ['order'];
            modules[moduleIndex].classes[courseIndex].private = true;

            if (isExcel && !slashFilePath[2].includes('~') && !slashFilePath[2].includes('$')) {
              console.log(slashFilePath,courseIndex,modules[moduleIndex].classes[courseIndex])
              const { moduleData, questionsData } = await resolveExcelFile(file);
              const percentage = moduleData.percentageToPass === 'number'
                ? moduleData.percentageToPass
                : Number(moduleData.percentageToPass.replace('%',''))/100
              modules[moduleIndex].classes[courseIndex] = {
                ...modules[moduleIndex].classes[courseIndex],
                ...moduleData,
                questions:questionsData,
                numQuestions:questionsData.length,
                numToPass: Math.ceil(percentage*questionsData.length),
                type:'test'
              }
              return 'teste';
            }
          }


          return 'video file';
        }));
        console.log('modules',modules)
        handleSelectModules(modules);
      }
    } catch (error) {
      if (typeof error !== 'string') return console.log('error', error);
      switch (error) {
        case 'wrong_path':
          notification.modal({
            title: 'Error ao importar arquivos',
            text:
              'A estrutura de pastas encontra-se diferente do que é esperado, reveja as orientção para se inserir um novo curso. Pasta > Módulos > (arquivos de videos e teste)',
            rightBnt: 'Sair',
            open: true,
          });
          break;

        case 'wrong_format':
          notification.modal({
            title: 'Error ao importar arquivos',
            text:
              'A o nome das pastas encontra-se diferente do que é esperado, reveja as orientção para se inserir um novo curso.',
            rightBnt: 'Sair',
            open: true,
          });
          break;

        default:
          notification.error({message:error})
          break;
      }
      console.log('error', error);
    }
    if (ref.current) ref.current.value = '';
  };

  return (
    <>
      <Text>
        Selecione a pasta com os vídeos conforme o modelo explicado no vídeo
      </Text>
      <Input
        accept="video/mp4,video/x-m4v,video/*"
        onChange={onInputFileChange}
        type="file"
        ref={ref}
      />
    </>
  );
};

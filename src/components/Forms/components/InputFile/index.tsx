/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import styled from 'styled-components';
import { useNotification } from '../../../../context/NotificationContext';

const Input = styled.input`
  margin-right: auto;
  width: 100%;
`;

interface FileResult {
  webkitRelativePath?: string;
}

type newFile = File & FileResult;

export const InputFile = (): React.ReactElement => {
  const notification = useNotification();
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('directory', '');
      ref.current.setAttribute('webkitdirectory', '');
    }
  }, [ref]);

  const resolveExcelFile = (file: newFile): any => {};

  const onInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    const classStructure = {};

    try {
      if (e.target.files)
        Object.values(e.target.files).map((file: newFile): string => {
          // eslint-disable-next-line prettier/prettier
          const isExcel = file.type && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          const isVideo = file.type && file.type.includes('video/');
          if (isExcel) {
            resolveExcelFile(file);
            return 'teste';
          }
          if (!isVideo) return 'not a video file';
          if (file?.webkitRelativePath) {
            const slashFilePath = file.webkitRelativePath.split('/');
            if (slashFilePath.length !== 3) throw 'wrong_path';

            const module = slashFilePath[1].split('-');

            const moduleIndex = slashFilePath[1].split('-')[0];
            const moduleName = slashFilePath[1].split('-')[1];
            const courseIndex = slashFilePath[2].split('-')[0];
            const courseName = slashFilePath[2].split('-')[1];

            // classStructure.modules[]
            console.log('slashFilePath', slashFilePath);
          }
          return 'not a video file';
        });
    } catch (error) {
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

        default:
          break;
      }
      console.log('error', error);
    }
  };

  return (
    <Input
      accept="video/mp4,video/x-m4v,video/*"
      onChange={onInputFileChange}
      type="file"
      ref={ref}
    />
  );
};

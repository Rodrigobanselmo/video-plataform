/* eslint-disable no-nested-ternary */
import React, { ReactElement } from 'react';
import { ButtonView, Button } from './styles';

interface IButtonComponent {
  toolbar: boolean;
  save: boolean;
  autoSave?: boolean;
  setToolbar: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
}

export const DraftButtons = ({
  toolbar,
  autoSave,
  save,
  setToolbar,
  handleSave,
}: IButtonComponent): ReactElement => {
  const handleOnSave = (): void => {
    setToolbar(false);
  };

  const handleOnDiscard = (): void => {
    setToolbar(false);
  };

  const handleOnEditStop = (): void => {
    if (toolbar && autoSave) {
      handleSave();
      setToolbar(false);
    } else setToolbar(true);
  };

  return (
    <ButtonView>
      {!toolbar || autoSave ? (
        <Button
          appearance={toolbar ? 'outlined' : 'normal'}
          onClick={handleOnEditStop}
          type="button"
        >
          {save ? 'salvando...' : toolbar ? 'Parar' : 'Editar'}
        </Button>
      ) : (
        <>
          <Button appearance="outlined" onClick={handleOnDiscard} type="button">
            Descartar
          </Button>
          <Button onClick={handleOnSave} type="button">
            Salvar
          </Button>
        </>
      )}
    </ButtonView>
  );
};
// const editorRef = useRef<HTMLInputElement | null>(null);

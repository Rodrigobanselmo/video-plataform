import React, { ReactElement } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, convertFromRaw, Modifier } from 'draft-js';
import { ButtonView, Button } from './styles';

interface IButtonComponent {
  toolbar: boolean;
  autoSave?: boolean;
  setToolbar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DraftButtons = ({
  toolbar,
  autoSave,
  setToolbar,
}: IButtonComponent): ReactElement => {
  const handleOnSave = (): void => {
    setToolbar(false);
  };

  const handleOnDiscard = (): void => {
    setToolbar(false);
  };

  const handleOnEditStop = (): void => {
    if (toolbar && autoSave) setToolbar(false);
    else setToolbar(true);
  };

  return (
    <ButtonView>
      {!toolbar || autoSave ? (
        <Button
          appearance={toolbar ? 'outlined' : 'normal'}
          onClick={handleOnEditStop}
          type="button"
        >
          {toolbar ? 'Parar' : 'Editar'}
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

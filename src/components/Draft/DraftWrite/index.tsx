import React, { ReactElement } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import {
  convertToRaw,
  EditorState,
  convertFromRaw,
  Modifier,
  RawDraftContentState,
} from 'draft-js';
import styled, { css } from 'styled-components';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Container } from './styles';
import '../style.css';
import { useNewDebounce } from '../../../hooks/useNewDebounce';
import { DraftButtons } from '../components/DraftButtons';

type Props = React.ComponentPropsWithoutRef<typeof Container>;

interface IDraftWrite extends Props {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  toolbarHidden?: boolean;
  initialEditorState?: RawDraftContentState | null;
  onSave: (value: RawDraftContentState) => void;
  autoSave?: boolean;
  placeholder?: string;
  allVisible?: boolean;
}
// esse component salva automaticamente, para controla quando salvar criar funcionalidade
export const DraftWrite = ({
  size = 'm',
  allVisible = false,
  initialEditorState,
  placeholder = 'Escreva aqui',
  onSave,
  autoSave,
  ...rest
}: IDraftWrite): ReactElement => {
  const [toolbar, setToolbar] = React.useState(false);
  const { onDebounce } = useNewDebounce();
  const { onDebounce: onDebounceAway, onClearDebounce } = useNewDebounce();
  const [editorState, setEditorState] = React.useState(
    initialEditorState
      ? EditorState.createWithContent(convertFromRaw(initialEditorState))
      : EditorState.createEmpty(),
  );

  const handleChange = (value: EditorState): void => {
    onClearDebounce();
    onDebounce(() => {
      onSave(convertToRaw(value.getCurrentContent()));
    }, 3000);
    setEditorState(value);
  };

  const handleClickAway = (): void => {
    onDebounceAway(() => {
      setToolbar(false);
    }, 10000);
  };

  const onTab = (e: React.KeyboardEvent): void => {
    e.nativeEvent.preventDefault();
    const contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '   ',
      editorState.getCurrentInlineStyle(),
    );

    handleChange(
      EditorState.push(editorState, contentState, 'insert-characters'),
    );
    console.log('event', e);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Container {...rest}>
        <Editor
          editorState={editorState}
          onEditorStateChange={handleChange}
          onTab={onTab}
          placeholder={placeholder}
          wrapperClassName="wrapper_content"
          editorClassName={`editor_content maxHeight_${size} ${
            allVisible ? 'full' : ''
          }`}
          onFocus={() => setToolbar(true)}
          toolbar={{
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
          }}
          toolbarHidden={!toolbar}
          // toolbarHidden
          // readOnly
          // editorRef={(r: any) => {
          //   if (r) editorRef.current = r;
          // }}
          // handleKeyCommand={keyBindingFn}
        />
        <DraftButtons
          toolbar={toolbar}
          autoSave={autoSave}
          setToolbar={setToolbar}
        />
      </Container>
    </ClickAwayListener>
  );
};
// const editorRef = useRef<HTMLInputElement | null>(null);

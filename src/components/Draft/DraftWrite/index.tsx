import React, { ReactElement, useEffect } from 'react';
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
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useNewDebounce } from '../../../hooks/useNewDebounce';
import { DraftButtons } from '../components/DraftButtons';
import { Container } from './styles';
import '../style.css';

type Props = React.ComponentPropsWithoutRef<typeof Container>;

interface IDraftWrite extends Props {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  toolbarHidden?: boolean;
  initialEditorState?: RawDraftContentState | null;
  onSave: (value: RawDraftContentState) => void;
  autoSave?: boolean;
  placeholder?: string;
  selector?: string;
  allVisible?: boolean;
  restart?: boolean;
}
// esse component salva automaticamente, para controla quando salvar criar funcionalidade
export const DraftWrite = ({
  size = 'm',
  allVisible = false,
  initialEditorState,
  restart,
  placeholder = 'Escreva aqui',
  onSave,
  selector,
  autoSave,
  ...rest
}: IDraftWrite): ReactElement => {
  // const draftContent = useSelector((state: any) => state[selector || 'user']);
  const store = useStore();
  const dispatch = useDispatch();
  const [toolbar, setToolbar] = React.useState(false);
  const [save, setSave] = React.useState(false);
  const { onDebounce, onClearDebounce } = useNewDebounce();
  const {
    onDebounce: onDebounceAway,
    onClearDebounce: onClearDebounceAway,
  } = useNewDebounce();
  const [editorState, setEditorState] = React.useState(
    initialEditorState
      ? EditorState.createWithContent(convertFromRaw(initialEditorState))
      : EditorState.createEmpty(),
  );

  useEffect(() => {
    const draftContent = store.getState()[selector || 'none'];
    if (draftContent)
      setEditorState(
        EditorState.createWithContent(convertFromRaw(draftContent)),
      );
    if (!draftContent) setEditorState(EditorState.createEmpty());
  }, [restart]);

  const handleChange = (value: EditorState): void => {
    dispatch({ type: 'TO_SAVE' });
    onClearDebounceAway();
    if (!save) setSave(true);
    onDebounce(() => {
      setSave(false);
      onSave(convertToRaw(value.getCurrentContent()));
    }, 1000);
    setEditorState(value);
  };

  const handleClickAway = (): void => {
    onDebounceAway(() => {
      setToolbar(false);
    }, 10000);
  };

  const handleSave = (): void => {
    onClearDebounce();
    setSave(false);
    onSave(convertToRaw(editorState.getCurrentContent()));
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
          save={save}
          setToolbar={setToolbar}
          handleSave={handleSave}
        />
      </Container>
    </ClickAwayListener>
  );
};
// const editorRef = useRef<HTMLInputElement | null>(null);

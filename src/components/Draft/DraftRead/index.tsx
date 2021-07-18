/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, convertFromRaw } from 'draft-js';
import { Container } from './styles';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import usePersistedState from '../../../hooks/usePersistedState';
// interface Props {
//   image: string;
//   title: string;
//   text: string;
//   onClick: () => void;
// }

type Props = React.ComponentPropsWithoutRef<typeof Container>;

// export const CardCurso = ({ onClick, image, title, text }: Props) => {
export const CursoTabs = ({ ...rest }: Props) => {
  const [editorStateS, setEditorStateS] = usePersistedState(
    'cursosq1234',
    EditorState.createEmpty(),
  );
  // const [editorState, setEditorState] = React.useState(
  //   EditorState.createWithContent(convertFromRaw(editorStateS)),
  // );

  const [tabValue, setTabValue] = React.useState(0);
  const tabsLabel = ['Sobre o curso', 'Público Alvo', 'Professores'];

  const handleTabChange = (value: any) => {
    setTabValue(value);
  };

  const handleChange = (value: any) => {
    // setEditorState(value);
  };

  return (
    <Container {...rest}>
      <Editor
        toolbarHidden
        readOnly
        defaultEditorState={EditorState.createWithContent(
          convertFromRaw(editorStateS),
        )}
        // editorState={editorState}
        // onEditorStateChange={handleChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      {/* <button
        type="button"
        onClick={() => {
          setEditorStateS(convertToRaw(editorState.getCurrentContent()));
          console.log(editorState);
          console.log(convertToRaw(editorState.getCurrentContent()));
          console.log(
            EditorState.createWithContent(convertFromRaw(editorStateS)),
          );
        }}
      >
        click
      </button> */}
    </Container>
  );
};

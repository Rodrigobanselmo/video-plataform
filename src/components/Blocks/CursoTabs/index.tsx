/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, convertFromRaw } from 'draft-js';
// import { lighten } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { Container } from './styles';
import usePersistedState from '../../../hooks/usePersistedState';
import { db } from '../../../lib/firebase.prod';

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  margin: 5px 10px 10px 0;
  border-radius: 4px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.palette.background.default};
  /* background-image: linear-gradient(to bottom right, #d2d5d5, #bdbec3); */
  border: 0;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.22);
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.23);
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
  z-index: 10;
  transition: filter 0.2s;

  &:disabled {
    background: ${({ theme }) => theme.palette.background.inactive};
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }

  &:hover {
    filter: brightness(0.95);
  }

  ${(props) =>
    props.active &&
    css`
      color: ${({ theme }) => theme.palette.primary.contrastText};
      background-image: linear-gradient(
        -10deg,
        ${({ theme }) => theme.palette.primary.main},
        ${({ theme }) => theme.palette.primary.light}
      );
    `}

  @media screen and (max-width: 700px) {
    font-size: 14px;
    display: flex;
    flex-grow: 1;
    padding: 6px 10px;
    min-width: fit-content;
  }
`;

const Tabs = styled.div`
  display: flex;
  align-items: row;
  overflow-x: auto;
`;

const TabSection = styled.div`
  width: 100%;
  /* display: flex; */
  /* flex-direction: column; */
  /* flex: 1; */
  /* height: 550px; */
  min-height: 200px;
  border-radius: 10px;
  /* border-top-left-radius: 0px; */
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.19);
  background-color: white;
  overflow-y: auto;
  padding: 0 20px;
`;

interface Props extends React.ComponentPropsWithoutRef<typeof Container> {
  data: any;
}

export const CursoTabs = ({ data, ...rest }: Props): JSX.Element => {
  const [tabValue, setTabValue] = React.useState(0);
  const tabsLabel = ['Sobre o curso', 'Público Alvo', 'Professores'];

  const handleTabChange = (event: React.SyntheticEvent, index: number) => {
    event.preventDefault();
    setTabValue(index);
  };

  return (
    <Container {...rest}>
      <Tabs>
        {tabsLabel.map((item, index) => {
          const isActive = index === tabValue;
          return (
            <Tab
              key={item}
              type="button"
              active={isActive}
              onClick={(e) => handleTabChange(e, index)}
            >
              {item}
            </Tab>
          );
        })}
      </Tabs>
      <TabSection>
        {tabValue === 0 && (
          <Editor
            toolbarHidden
            readOnly
            defaultEditorState={EditorState.createWithContent(
              convertFromRaw(data[1].text),
            )}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
          />
        )}
      </TabSection>
    </Container>
  );
};

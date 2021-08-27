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
import {
  FaFacebookF as Facebook,
  FaLinkedinIn as LinkedIn,
  FaInstagram as Instagram,
} from 'react-icons/fa';
import { Container } from './styles';
import usePersistedState from '../../../hooks/usePersistedState';
import { db } from '../../../lib/firebase.prod';
import { useProfessionals } from '../../../services/hooks/get/useProfessionals';

const ProfessionalView = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  /* gap: 5px; */

  > p {
    font-size: 1rem;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  > ul {
    margin: -5px 0 10px 30px;
  }
`;

const Grid = styled.div`
  display: flex;
  gap: 20px;
  margin: 2.5rem 0 1.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.palette.background.line};
  padding: 0 0 30px 0;

  &:first-child {
    margin-top: 2rem;
  }

  img {
    object-fit: cover;
    height: 4rem;
    width: 4rem;
    border-radius: 100px;
  }
`;

const Link = styled.a`
  color: #fff;
  padding: 8px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  display: flex;
  width: fit-content;
  svg {
    font-size: 1.2rem;
  }

  &:hover {
    filter: brightness(0.8);
  }
`;

interface TabProps {
  active: boolean;
}

interface Props extends React.ComponentPropsWithoutRef<typeof Container> {
  professionals: Array<{
    name: string;
    uid: string;
    photoURL: string;
    resume: string;
    social: {
      LinkedIn: string;
      instagram: string;
      facebook: string;
    };
    curriculum: string[];
    sendEmail: boolean;
  }>;
}

export const ProfessionalLayout = ({ professionals }: Props): JSX.Element => {
  return (
    <Container>
      {professionals.map((profession) => {
        return (
          <Grid key={profession.uid}>
            <img alt="perfil do profissional" src={profession.photoURL} />
            <ProfessionalView>
              <h3>{profession.name}</h3>
              <p>{profession.resume}</p>
              <ul>
                {profession.curriculum.map((text) => (
                  <li>{text}</li>
                ))}
              </ul>
              <div style={{ gap: '0.6rem', display: 'flex' }}>
                {Object.entries(profession.social).map(([social, href]) => {
                  if (href) return null;
                  return (
                    <Link
                      key={social}
                      target="_blank"
                      rel="noreferrer"
                      href={href}
                    >
                      {social === 'facebook' && <Facebook />}
                      {social === 'instagram' && <Instagram />}
                      {social === 'LinkedIn' && <LinkedIn />}
                    </Link>
                  );
                })}
              </div>
            </ProfessionalView>
          </Grid>
        );
      })}
    </Container>
  );
};

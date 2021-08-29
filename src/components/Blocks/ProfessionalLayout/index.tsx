/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, convertFromRaw } from 'draft-js';
// import { lighten } from '@material-ui/core';
import {
  FaFacebookF as Facebook,
  FaLinkedinIn as LinkedIn,
  FaInstagram as Instagram,
} from 'react-icons/fa';
import { Container, Grid, ProfessionalView, Link } from './styles';

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

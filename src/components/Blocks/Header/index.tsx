/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import styled from 'styled-components';
import HelpIcon from '@material-ui/icons/Help';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import { ModalFullScreen } from '../../Modal/ModalFullScreen';

const GroupIcon = styled(ScreenShareIcon)`
  font-size: 50px;
  //color:${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const GroupIconVideo = styled(HelpIcon)`
  font-size: 50px;
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 26px;
  margin-bottom: -3px;
  cursor: pointer;
`;

const TitleTag = styled.div`
  height: 70px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  width: 70px;
  margin-right: 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.23);
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.23);

  svg {
    font-size: 40px;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 30px;
  display: inline-block;
  margin-right: 18px;
  /* text-shadow: 1px 1px 1px #CE5937; */
`;

const Header = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0px 0px 40px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface IHeader {
  video?: boolean;
  title: string;
  subTitle?: string[] | string;
  path?: string;
  icon?: JSX.Element;
}

export const HeaderComponent = React.memo(
  ({ title, path, video = false, subTitle, icon }: IHeader) => {
    const [open, setOpen] = React.useState(false); // dados dos email inseridos nos inputs

    return (
      <Header>
        <TitleTag>{icon || <ScreenShareIcon />}</TitleTag>
        <div>
          <div style={{ marginRight: 10, flexDirection: 'row' }}>
            <Title>{title}</Title>
            {video && (
              <div onClick={() => setOpen(true)} style={{ display: 'inline' }}>
                <GroupIconVideo type="Video" />
              </div>
            )}
          </div>
          <p>
            App
            {subTitle && Array.isArray(subTitle) ? (
              subTitle.map((item) => (
                <span key={item} style={{ color: 'grey' }}>
                  &nbsp;/&nbsp;{item}
                </span>
              ))
            ) : (
              <span style={{ color: 'grey' }}>
                &nbsp;/&nbsp;{path ?? title}
              </span>
            )}
          </p>
        </div>
        <ModalFullScreen transparent open={open} onClose={() => setOpen(false)}>
          <iframe
            title="Video de ajuda"
            width={`${window.innerWidth * 0.8}`}
            height={`${(window.innerWidth * 0.8 * 360) / 640}`}
            src="http://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
            frameBorder="0"
          />
        </ModalFullScreen>
      </Header>
    );
  },
);

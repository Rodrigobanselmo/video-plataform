import styled from 'styled-components';
import { fade } from '@material-ui/core/styles';

export const ChatContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding-right: 40px;

  @media screen and (max-width: 700px) {
    padding-right: 20px;
  }
`;

export const TableTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const Item = styled.button`
  display: grid;
  border-radius: 5px;
  position: relative;
  border: none;
  background-color: ${({ theme }) => theme.palette.background.paper};
  width: 100%;
  align-items: center;
  grid-template-columns: 1fr 1fr 0.6fr;
  padding: 0.8rem 1.25rem;
  cursor: pointer;

  p {
    text-align: left;
    font-size: 0.9rem;
    max-width: 100%;
    padding-right: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:after {
    position: absolute;
    content: '';
    bottom: 0px;
    left: 1.25rem;
    width: calc(100% - 2.5rem);
    height: 1px;
    background-color: ${({ theme }) => theme.palette.background.line};
  }

  &:hover {
    background-color: ${({ theme }) => fade(theme.palette.primary.main, 0.1)};
  }
`;

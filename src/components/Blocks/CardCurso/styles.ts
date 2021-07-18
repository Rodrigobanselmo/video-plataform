import styled from 'styled-components';

interface CardProps {
  imageURL: string;
}

export const CursoCard = styled.div<CardProps>`
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.29);
  position: relative;
  display: flex;
  flex: 1;
  width: fit-content;
  overflow: hidden;
  flex-direction: column;
  border-radius: 10px;
  cursor: pointer;

  .backImage {
    width: 100%;
    height: 150px;
    position: relative;
    background-position: center center;
    background-image: url(${({ imageURL }) => imageURL});
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 0.3s ease;
  }

  .gradient {
    position: absolute;
    width: 100%;
    height: 150px;
    background-image: linear-gradient(to top, #202026, transparent);
    z-index: 1;
  }

  &:hover {
    .backImage {
      transform: scale(1.2);
    }
  }
`;

export const BottomView = styled.div`
  display: flex;
  flex: 1;
  z-index: 2;
  background-color: #202026;
  justify-content: flex-end;
  width: 250px;
  padding: 0 15px 15px 15px;
  height: fit-content;
  flex-direction: column;
`;

export const NameText = styled.p`
  font-weight: bold;
  font-size: 18px;
  color: #eee;
  z-index: 10;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
`;

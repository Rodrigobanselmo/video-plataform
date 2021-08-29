import styled from 'styled-components';

// interface CardProps {
//   imageURL: string;
// }

export const Container = styled.div`
  width: 100%;
  position: relative;
  /* border-radius: 10px; */
  /* box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.19); */
  /* height: 600px; */
  height: fit-content;
  /* min-height: 200px; */
  /* background-color: white; */
  /* overflow-y: auto; */
`;

export const ProfessionalView = styled.div`
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

export const Grid = styled.div`
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

export const Link = styled.a`
  color: #fff;
  padding: 8px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  display: flex;
  width: fit-content;
  transform: scale(0.8) translate(-10px, -5px);
  svg {
    font-size: 1.2rem;
  }

  &:hover {
    filter: brightness(0.8);
  }
`;

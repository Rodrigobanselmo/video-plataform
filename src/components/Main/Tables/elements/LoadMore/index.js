import React from 'react';
import styled, { css } from 'styled-components';
import Skeleton from '@material-ui/lab/Skeleton';

const TotalText = styled.span`
  opacity: 0.7;
`;

const Container = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const VisualizeMore = styled.p`
  text-align: right;
  display: block;
  width: fit-content;
  margin-left: 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
  &:active {
    opacity: 0.4;
  }
`;

export function LoadMoreTableCells({
  shown = 0,
  total = 0,
  handleMore = false,
}) {
  const [load, setLoad] = React.useState(false);

  function handleMoreCells() {
    handleMore(setLoad);
  }

  return (
    <>
      {load ? (
        <LoadSkeleton />
      ) : (
        <Container>
          {!!shown && !!total && (
            <TotalText>
              Total: {shown}/{total}
            </TotalText>
          )}
          {handleMore && (
            <VisualizeMore onClick={handleMoreCells}>
              Visualizar mais
            </VisualizeMore>
          )}
        </Container>
      )}
    </>
  );
}

export function LoadSkeleton({ rows = 5, header }) {
  return (
    <>
      {Array.from(Array(rows).keys()).map((i, index) => (
        <Skeleton
          key={String(index)}
          style={{
            height: header ? 40 : 85,
            marginTop: header ? 0 : -20,
            marginBottom: 0,
          }}
          animation="wave"
        />
      ))}
    </>
  );
}

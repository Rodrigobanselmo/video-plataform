import React from 'react'
import styled,{css} from "styled-components";
import Skeleton from '@material-ui/lab/Skeleton';

const VisualizeMore = styled.p`
  text-align: right;
  padding-top: 10px;
  display:block;
  width: fit-content;
  margin-left: auto;
  cursor:pointer;

  &:hover {
    opacity:0.6;
  }
  &:active {
    opacity:0.4;
  }
`;

export function LoadMoreTableCells() {
  const [load, setLoad] = React.useState(false)

  function handleMore() {
    setLoad(true)
    setTimeout(() => {
      setLoad(false)
    }, 1000);
  }

  return (
    <>
      {load?
        <LoadSkeleton/>
      :
        <VisualizeMore onClick={handleMore}>Visualizar mais</VisualizeMore>
      }
    </>
  )
}

export function LoadSkeleton({rows=5,header}) {
  return (
    <>
      {Array.from(Array(rows).keys()).map((i,index)=>(
          <Skeleton  key={String(index)}  style={{height:header?40:85,marginTop:header?0:-20,marginBottom:0}} animation="wave" />
        )
      )}
    </>
  )
}

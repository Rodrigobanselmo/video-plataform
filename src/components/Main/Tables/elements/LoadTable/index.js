import React from 'react'
import styled,{css} from "styled-components";
import { LoadSkeleton } from '../LoadMore';

const Container = styled.div`
  margin-top: 0rem;
  margin-bottom: 0rem;

  table {
    width: 100%;
    border-spacing: 0 0.7rem;

    th {
      color: ${({theme})=>theme.palette.text.secondary};
      font-weight: 400;
      padding: 0rem 2rem 0rem 2rem;
      text-align: left;
      line-height: 1.5rem;
    }

    tbody tr {
      border-radius: 0.25rem;
      -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2);
      box-shadow:  1px 1px 2px 1px rgba(0,0,0,0.2);
      &.clean {
        background-color: transparent;
        -webkit-box-shadow: none;
        box-shadow:  none;
      }
    }

    td {
      padding: 1rem 2rem;
      min-width:150px;
      background: ${({theme})=>theme.palette.background.paper};
      border-radius: 0.25rem;
      border: 0;
      color: ${({theme})=>theme.palette.text.primary};

      span {
        opacity:0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &:first-child {
        width:30%;
        span {
          opacity:1;
        }
      }

      &.clean {
        background-color: transparent;
        -webkit-box-shadow: none;
        box-shadow:  none;
        padding:0;
      }
    }

    td.url {
      padding: 0rem 2rem;
      align-self: flex-start;
      div {
        display:flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;

        span {
          display:flex;
          flex:1;
        }
      }
    }

  }
`;

export function LoadTable({rows=5,columns=5}) {

  return (
    <Container>
      <table>
        <thead>
          <tr>
            {Array.from(Array(columns).keys()).map((i,index)=>(
              <th key={String(index)}><LoadSkeleton rows={1} header/></th>
              )
            )}
          </tr>
        </thead>
        <tbody className='clean' >
          <tr className='clean' >
            <td className='clean' colSpan="5">
              <LoadSkeleton rows={rows}/>
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  )
}

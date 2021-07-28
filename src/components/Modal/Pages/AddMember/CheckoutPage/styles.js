
import styled from "styled-components";
import FormControlLabel from '@material-ui/core/FormControlLabel';

export const ContainerCheckout = styled.div`
  display: grid;
  position:relative;
  grid-template-columns: 2fr 1fr;
  max-width: 1200px;
  margin: auto;
  height:85vh;
  max-height:85vh;
  width:100%;
  padding:0 10px;
  gap: 20px;

  @media screen and (max-width: 600px) {
    margin: 0 0px;
    margin-top: 70px;
    width:95%;
  }
  @media screen and (max-width: 800px) {
    margin: 0 0px;
    margin-top: 70px;
    width:95%;
  }
  @media screen and (max-width: 1000px) {
    margin: 0 0px;
    margin-top: 70px;
    width:95%;
  }
`;

export const Cart = styled.div`
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  overflow-y:hidden;
  display: flex;
  flex-direction:column;
  background-color: ${({theme})=>theme.palette.background.paper};
  padding: 20px 20px;
  border-radius:15px;

  > h1 {
    color: ${({ theme }) => theme.palette.text.primary};
    opacity:0.8;
  }

  > h2 {
    color: ${({ theme }) => theme.palette.text.primary};
    opacity:0.8;
    font-weight:500;
  }
`;

export const PriceTable = styled.div`

  background-color: ${({theme})=>theme.palette.background.line};
  margin-top: 10px;
  overflow-y:auto;
  overflow-x:visible;
  border-top-left-radius:15px;
  border-bottom-left-radius:15px;
  border-top-right-radius:15px;
  border-bottom-right-radius:15px;
  border: 2px solid ${({theme})=> theme.palette.background.line };
  padding: 20px 15px;
`;


export const PriceTag = styled.div`
  display: grid;
  margin-bottom: 10px;
  border-radius:15px;
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  background-color: ${({theme})=>theme.palette.background.paper};
  padding:15px 40px 10px 40px;
  grid-template-columns: 1fr fit-content;
  grid-template-rows: fit-content;
  align-items:center;
  grid-template-areas:
  "i i p"
  "n n p"
  "c c p"
  "curso curso p";

  > p {
    color: ${({ theme }) => theme.palette.text.third};
    font-weight:bold;

    span {
      margin-left: 3px;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
  }

  p.name {
    margin-bottom: 5px;
    grid-area: n;
  }

  p.cpf {
    margin-bottom: 5px;
    grid-area: c;
  }

  p.info {
    margin-bottom: 5px;
    grid-area: i;
    cursor: pointer;
  }

  p.price {
    font-size:1rem;
    grid-area: p;
    justify-self:flex-end;
    border-left: 1px solid ${({theme})=> theme.palette.background.line };
    padding: 8px;
    padding-left:1rem;

    span {
      opacity:0.7;
      color: ${({ theme }) => theme.palette.text.primary};
    }
  }
`;

export const CursosView = styled.div`
  display:flex;
  align-items: center;
  gap:0.5rem;
  flex-wrap: wrap;
  grid-area: curso;
  margin-top: 5px;
  margin-bottom: 5px;

  p {
    font-size:0.80rem;
    font-weight:bold;
    color: ${({ theme }) => theme.palette.text.light};
    padding:0px 10px;
    border: 1px solid ${({theme})=> theme.palette.background.line };
    border-radius: 4px;
    background-color: ${({ theme }) => theme.palette.primary.main};
  }

  span {
    color: ${({ theme }) => theme.palette.text.third};
    font-weight:bold;
  }
`;

export const TotalPrice = styled.div`
  height:fit-content;
  margin-top: 10px;
  /* border-top: 1px double ${({theme})=> theme.palette.background.line }; */
  p {
    width:fit-content;
    margin-left:auto;
    padding-top: 20px;
    padding-bottom: 15px;
    border-bottom: 1px double ${({theme})=> theme.palette.background.line };
    font-size:1.2rem;
    grid-area: p;
    text-align: right;
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight:bold;

    span {
      opacity:0.7;
      color: ${({ theme }) => theme.palette.text.primary};
    }
  }
`;



export const PaymentSide = styled.div`
  -webkit-box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  box-shadow: 3px 3px 11px 1px rgba(0,0,0,0.23);
  display:flex;
  width:100%;
  height:fit-content;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius:15px;
  display: flex;
  flex-direction:column;
  padding: 10px 20px 20px;
  color: ${({ theme }) => theme.palette.text.secondary};

  h1 {
    color: ${({ theme }) => theme.palette.text.primary};
    opacity:0.8;
  }

`;

export const TypePaymentText = styled.p`
  font-size:0.92rem;
  margin: 5px 0 0 0;
`;

export const ButtonPaymentMethod = styled.div`
  display: flex;
  margin: 2px 0 10px;
  border: 1px solid ${({theme})=> theme.palette.background.inactive };
  padding: 2px 5px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius:5px;
  font-weight:bold;
`;

export const Explanation = styled.p`
  margin: 0px 0 10px;
  font-size:1rem;
`;

export const FormLabel = styled(FormControlLabel)`
  color: ${({theme})=>theme.palette.text.primary};
  margin-top: 10px;
  margin-bottom: 20px;
  font-size:0.85rem;
  margin-left: 20px;
  align-items: flex-start;

  &&&.MuiFormControlLabel-root {
    align-self: flex-start;
    align-items: flex-start;
    padding-bottom:5px;
  }
`;

export const TotalPayment = styled.p`
  margin: 10px 0 6px;
  font-size:1rem;

  span {
    font-weight:bold;
  }
`;

export const ButtonFinal = styled.button`
  padding: 8px 8px;
  color: ${({ theme }) => theme.palette.text.light};
  border:none;
  border-radius:10px;
  font-weight:bold;
  font-size:1.1rem;
  background-color: ${({ theme }) => theme.palette.primary.light};
  background-image: linear-gradient(-10deg, ${({theme})=>theme.palette.primary.main}, ${({theme})=>theme.palette.primary.light});
`;

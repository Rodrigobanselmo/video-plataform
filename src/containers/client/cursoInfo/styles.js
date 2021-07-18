import styled from "styled-components";

export const Container = styled.div`

margin:auto;
max-width:1400px;
display: grid;
grid-template-columns: 1.3fr 1.3fr 1.3fr minmax(280px, 1.8fr);
align-items: flex-start;
gap: 0px 30px;
grid-template-areas:
  "h1 h1 h1 h0"
  "p1 p1 p1 b1"
  "c1 c2 c3 b1"
  "h2 h2 h2 h2"
  "bt bt bt bt"
  "h3 h3 h3 h3"
  "bs bs bs bs";


  > p {
    align-self:flex-start;
    font-size:1rem;
    grid-area: p1;
    margin: 0 0 20px 0;
  }

> h1 {
  grid-area: h1;
  margin: 0 0 5px 0;
  font-size:2.5rem;
}

> h2 {
  grid-area: h2;
  margin: 20px 0 5px 0;
  font-size:1.6rem;
  margin-bottom: 20px;
}

> h3 {
  grid-area: h3;
  margin: 40px 0 5px 0;
  font-size:1.6rem;
  margin-bottom: 20px;
}


> div.aside {
  grid-area: b1;
  /* margin-left:30px; */
}

padding-right:54px;

@media screen and (max-width: 1200px) {
  padding-right:40px;
  grid-template-columns: 1.3fr 1.3fr 1.3fr;
  align-items: flex-end;
  gap: 0px 30px;
  grid-template-areas:
    "h1 h1 h1"
    "p1 p1 p1"
    "c1 c2 c3"
    "b1 b1 b1"
    "h2 h2 h2"
    "bt bt bt"
    "h3 h3 h3"
    "bs bs bs";


  > p {
    font-size:1rem;
    grid-area: p1;
    margin: 0 0 20px 0;
  }

  > div.aside {
    margin-top:10px;
    margin-left:0px;
  }
}

@media screen and (max-width: 900px) {
  padding-right:20px;
  div.imageCard {
    /* display:none; */
  }
  grid-template-columns: 1fr;
  grid-template-areas:
  "h1"
  "p1"
  "c1"
  "c2"
  "c3"
  "b1"
  "h2"
  "bt"
  "h3"
  "bs";

}

`;

export const CursoCard = styled.button`
box-shadow: 2px 3px 6px 1px rgba(0, 0, 0, 0.39);
position: relative;
display: flex;
flex: 1;
width:100%;
height:100%;
border:none;
overflow: hidden;
flex-direction: column;
/* margin-bottom:10px; */
border-radius: 10px;
cursor: pointer;

.backImage {
  width: 100%;
  height: 200px;
  position: relative;
  background-position: center center;
  background-image: url(${({ imageURL }) => imageURL});
  background-size: cover;
  background-repeat: no-repeat;
  transition: all 0.3s ease;
  @media screen and (min-width: 1200px) {
    height: 270px;
  }
}

.gradient {
  display: flex;
  color: white;
  font-weight:bold;
  font-size:22px;
  position: absolute;
  width: 100%;
  height: 200px;
  align-items: center;
  flex-direction:column;
  justify-content: center;
  background-image: linear-gradient(to top, #000, transparent);
  z-index: 1;
  @media screen and (min-width: 1200px) {
    height: 270px;
  }
}

&:hover {
  .backImage {
    transform: scale(1.1);
  }
}
`;

export const SideVideoBarTry = styled.div`
min-width: 100%;
height:600px;
box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.19);
display: flex;
flex-direction: column;
margin-top:6px;
flex: 0;
background-color: ${({theme})=>theme.palette.background.default};
border-radius: 5px;
position:relative;
> div {
  box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.19);
}


height:fit-content;
  overflow-y:visible;
  > div {
  box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.19);
    position:relative;
    height:fit-content;
  }


@media screen and (max-width: 900px) {
    height:fit-content;
  overflow-y:visible;
  > div {
  box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.19);
    position:relative;
    height:fit-content;
  }
}


`;

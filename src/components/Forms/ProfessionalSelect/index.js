/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import React, { useState, useImperativeHandle,useEffect } from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { BsInfoCircle } from 'react-icons/bs';
import styled, { css } from 'styled-components';
import { InputEnd, InputUnform } from '../../Main/MuiHelpers/Input';
import 'react-phone-number-input/style.css';
import IconButton from '@material-ui/core/IconButton';
import { BootstrapTooltip } from '../../Main/MuiHelpers/Tooltip';
import { useNotification } from '../../../context/NotificationContext';
import { queryClient } from '../../../services/queryClient';
import { InputSearch } from '../components/InputSearch';
import { filterObject } from '../../../helpers/ObjectArray';
import { fade } from '@material-ui/core/styles';
import { formatCPFeCNPJeCEPeCNAE, keepOnlyNumbers } from '../../../helpers/StringHandle';
import { useAuth } from '../../../context/AuthContext';
import { AvatarView } from '../../Main/Avatar';
import { useDispatch } from 'react-redux';

const Circle = styled.span`
  display: inline-block;
  position:relative;
  &:after {
    content: '';
    display: inline-block;
    width:10px;
    height:10px;
    border-radius:5px;
    margin-left:5px;
    border: 1px solid #202020;
    cursor:pointer;
  }

  ${(props) =>
    props.active &&
      css`
        &:after {
          border: 1px solid #555;
          background-color: ${({ theme }) => theme.palette.status.success};
        }
    `}
`;


const Empty = styled.p`
  padding:10px 20px;
  border:2px dashed ${({theme})=> theme.palette.background.line };
  text-align:center;
  border-radius:10px;
`;

export const InputsContainer = styled.div`
    display:flex;
    flex-direction:column;
    color: ${({theme})=> theme.palette.text.primary};
    width:100%;
    margin-bottom:20px;
    margin-top:10px;
    /* height:100%; */
`;

const IconDelete = styled(DeleteOutlineIcon)`
  color: ${({theme})=>theme.palette.primary.main};
  opacity:0.6;
`;

const InputArea = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
position:relative;
`;

export const IconEnd = styled(BsInfoCircle)`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.primary};
  /* ${(props) =>
    props.status === 'Normal' &&
    css`
      color: ${({ theme }) => theme.palette.text.primary};
    `} */
`;

export const Delete = styled(DeleteOutlineIcon)`
  color: ${({ theme }) => theme.palette.status.failD};
`;

export const EmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  /*     max-width:550px; */
  width: 100%;
  margin-bottom: 20px;
`;

export const AddAnother = styled.div`
  max-width: fit-content;
  padding: 7px 10px;
  border-radius: 5px;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.text.secondary};
  border-color: ${({ theme }) => theme.palette.background.inactive};
  border-width: 1px;
  border-style: solid;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const Item = styled.button`
  display: grid;
  border-radius:5px;
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
    max-width:100%;
    padding-right:10px;
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

const ProfessionalSelectComp = ({ refProfessional, professionalsArray }) => {

  const notification = useNotification()
  const {currentUser} = useAuth()
  const [users, setUsers] = useState([])
  const [occupation, setOccupation] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    const newOccupation = [];
    const newUsers = [];
    professionalsArray.map((professional, index) => {

      if (!queryClient.getQueryData(['users', currentUser.uid]).find(i=>i.uid === professional.userId))
        return null

      newOccupation[index] = professional.occupation
      newUsers[index] = {
        ...queryClient.getQueryData(['users', currentUser.uid]).find(i=>i.uid === professional.userId),
        sendEmail: professional.sendEmail,
      };
    })
    setOccupation(newOccupation)
    setUsers(newUsers)
  }, [professionalsArray])

  useImperativeHandle(refProfessional, ()=>{
    const data = {
      users,occupation
    }

    return data
  })

  function handleChange(e, index) {
    const newUsersRow = [...occupation]
    newUsersRow[index] = e.target.value
    dispatch({ type: 'TO_SAVE' });
    return setOccupation(newUsersRow)
  }

  function handleDeleteMember(index) {
    const newUsers = [...users];
    const newUsersRow = [...occupation];
    newUsers[index] = '';
    newUsersRow[index] = '';
    setUsers(newUsers.filter(i=>i));
    setOccupation(newUsersRow.filter(i=>i))
    dispatch({ type: 'TO_SAVE' });
  }

  function handleSelectEmail(index) {
    const newUsers = [...users];
    newUsers[index] = {...newUsers[index],sendEmail:!newUsers[index]?.sendEmail};
    dispatch({ type: 'TO_SAVE' });
    setUsers(newUsers);
  }

  function handleSelect(value,onClose) {
    dispatch({ type: 'TO_SAVE' });

    const newUsers = [...users]
    const indexAdded = newUsers.length
    newUsers[indexAdded] = {...value,sendEmail:true}
    setUsers(newUsers);

    const newUsersRow = [...occupation]
    newUsersRow[indexAdded] = ''
    setOccupation(newUsersRow)

    onClose()
  }

  const filter = async (data,search) => {

    // filter local
    const searchParams = ['name', 'cpf','email']
    const newData = []
    data.map((row)=>{
      if(searchParams[0] && filterObject(row,search,searchParams[0])) newData.push({...row})
      else if (searchParams[1] && filterObject(row,search,searchParams[1])) newData.push({...row})
      else if (searchParams[2] && filterObject(row,search,searchParams[2])) newData.push({...row})
    })
    return newData
  }

  const usersData = queryClient.getQueryData(['users', currentUser.uid]);
  const options = usersData?usersData.filter(i=>i?.status && i.status === 'Ativo' && i.permission.includes('pr') && !users.some(si=>si.email === i.email)):[]


  return (
    <>
      <h3 style={{ marginBottom: 5 }}>Selecionar Instrutores do Curso</h3>
      <InputSearch
        filter={filter}
        isTeam={true}
        onSelectItem={handleSelect}
        row={({item, ...rest})=>(
          <Item {...rest}>
            <p>{item?.razao ?? item?.name}</p>
            <p>{item?.email ?? item?.link}</p>
            <p>
              {item?.cnpj ? formatCPFeCNPJeCEPeCNAE(keepOnlyNumbers(item.cnpj)) : item?.cpf ? formatCPFeCNPJeCEPeCNAE(keepOnlyNumbers(item.cpf)) : '---------------------------'}
            </p>
          </Item>
        )}
        name={'selects'}
        options={options}
      />
      <InputsContainer style={{gap:20}}>
          {users.map((user, index) => {

            return (
              <div key={`${index}`}>
                <div style={{display: 'flex', flexDirection: 'row',alignItems: 'center',gap:20}}>
                  <AvatarView user={user}/>
                  <BootstrapTooltip title={`Remover membro.`} styletooltip={{transform: 'translateY(5px)'}}>
                    <IconButton style={{marginRight:-10, marginLeft:-10,zIndex:20,width:20,height:20}} onClick={() => handleDeleteMember(index)}  aria-label={'delete'}>
                      <IconDelete style={{fontSize:17}} type={'Trash'} />
                    </IconButton>
                  </BootstrapTooltip>
                  <div>
                    <p style={{fontSize:'1rem', width:'fit-content'}} className='oneLine'>{user.name}</p>
                    <p className='oneLine'>{user.email}
                      <BootstrapTooltip title={'Selecione para receber e-mails quando houver uma pergunta'} styletooltip={{transform: 'translateY(-5px)'}}>
                        <Circle onClick={() => handleSelectEmail(index)} active={user?.sendEmail}/>
                      </BootstrapTooltip>
                    </p>
                  </div>
                  <InputEnd
                  labelWidth={50}
                  label="Cargo"
                  width={'100%'}
                  style={{marginBottom:10}}
                  icon="Info"
                  name='duration'
                  variant="outlined"
                  value={occupation[index]}
                  onChange={(e)=>handleChange(e,index)}
                  title="Exemplos: 'Diretor', 'Instrutor', 'Professor', ..."
                  status="Normal"
                  validation
                />
                </div>
              </div>
            );
          })}
          {users.length === 0 && (
            <Empty>Nenhum instrutor selecionado</Empty>
          )}
      </InputsContainer>
    </>
  );
};

export const ProfessionalSelect = React.memo(ProfessionalSelectComp);

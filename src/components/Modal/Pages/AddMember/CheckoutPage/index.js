import React, {useState, useEffect,useMemo} from 'react';
import {useNotification} from '../../../../../context/NotificationContext'
import {useLoaderScreen} from '../../../../../context/LoaderContext'
import { useAuth } from '../../../../../context/AuthContext'
import {PagesDiv} from '../../../../Main/Carrousel/CarrouselFirst'
import { SellingContext } from '../../../../../context/data/SellingContext';
import { queryClient } from '../../../../../services/queryClient';
import {
  ContainerCheckout,
  Cart,
  PriceTable,
  PriceTag,
  CursosView,
  TotalPrice,
  PaymentSide,
  TypePaymentText,
  ButtonPaymentMethod,
  Explanation,
  FormLabel,
  TotalPayment,
  ButtonFinal
} from './styles';
import Checkbox from '@material-ui/core/Checkbox';
import { useCreateUsers } from '../../../../../services/hooks/set/useCreateUsers';

export const CheckoutPageComponent = ({checkoutInfo, totalPrice, onEnd}) => {

  const {currentUser} = useAuth();
  console.log(999999)

  const mutation = useCreateUsers()
  const notification = useNotification();
  const [checked, setChecked] = useState(false);

  const data = checkoutInfo?.data ? checkoutInfo.data : []

  function handleCopy(link,text) {
    navigator.clipboard.writeText(link)
    notification.success({message:`${text} copiado com sucesso`,modal:true})
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleConfirmPurchase = async() => {
    if (!checked) return notification.warn({message:'Para finalizar pagamento, confirme que está ciente sobre nossos temos',modal:true})
    console.log('checkoutInfo',checkoutInfo)

    const isAdmin = currentUser.access === 'admin'
    await mutation.mutateAsync({user:currentUser, noStatement:isAdmin,...checkoutInfo})
    onEnd()
  };

  return (
    <ContainerCheckout>
      <Cart>
        <h1>Dados da Compra</h1>
        <h2>Você possui {data.length} novos cadastros</h2>
        <PriceTable>
          {data.map((user,index)=>{
            const name = user?.name ? user.name : '________________'
            const cpf = user?.cpf ? user.cpf : '___________________'
            const cursos = user.cursos

            const info = user?.email ? 'E-mail' : 'Link'
            const infoData = user?.email ? user?.email : user?.link


            const price = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(user?.statement && user.statement[0] && user.statement[0]?.value ? user.statement[0].value : 0 )

            return (
              <PriceTag key={user.uid}>
                {user?.name && <p className='name'>Nome: <span>{name}</span></p>}
                {user?.cpf && <p className='cpf'>CPF: <span>{cpf}</span></p>}
                <p onClick={()=>handleCopy(infoData,info)} className='info'>{info}: <span>{infoData}</span></p>
                <p className='price'>Preço: <span>{price}</span></p>
                <CursosView>
                  <span>Cursos: </span>
                  {cursos.map((curso=>{
                    const hasEpi = curso?.epi ? curso.epi : []
                    return (
                      <div key={curso.name}>
                        <p>{curso.name}</p>
                        {hasEpi.map(epi=>{
                          return <p key={epi.name}>{epi.name}</p>
                        })}
                      </div>
                    )
                  }))}
                </CursosView>
              </PriceTag>
            )
          })}
        </PriceTable>
        <TotalPrice>
          <p>Total: <span>
          {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalPrice)}
          </span></p>
        </TotalPrice>
      </Cart>
      <PaymentSide>
        <h1>Pagamento</h1>
        <TypePaymentText>
          Método de pagamento:
        </TypePaymentText>
        <ButtonPaymentMethod>
            Faturamento mensal
        </ButtonPaymentMethod>
        <Explanation>
          Está compra irá entrar dentro do faturamento mensal junto com todas as outras despesas provenientes dos serviços da área de medicina e segurança do trabalho realizados pela empresa <b>Realiza</b> neste ultimo més.
        </Explanation>
        <FormLabel
          control={
          <Checkbox
            checked={checked}
            size={'small'}
            onChange={handleChange}
            style={{marginTop:-6}}
            name="checkedB"
            color="primary"
          />
          }
          label="Confirmo que estou ciente de como funciona o faturamento mensal"
        />
        <TotalPayment>
          Total a pagar:
            <span>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalPrice)}
            </span>
        </TotalPayment>
        <ButtonFinal onClick={handleConfirmPurchase}>
          Finalizar Compra
        </ButtonFinal>
      </PaymentSide>
    </ContainerCheckout>
  );
} ;

export const CheckoutPage = React.memo(CheckoutPageComponent)

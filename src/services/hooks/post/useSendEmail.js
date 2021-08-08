import { useMutation } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import clone from "clone";
import axios from 'axios';



export async function onCallSendEmail(data,currentUser) { //data = array of users {}

  const { email, subject, html } = data

  const dataInfo = {
    to: email,
    subject,
    html
  }

  // const response = await axios.post('https://us-central1-reconecta-dev.cloudfunctions.net/mailer',dataInfo)
  // console.log(response)
  return email
}

export function useSendEmail() {
  const notification = useNotification()
  const { currentUser } = useAuth()

  return useMutation(async(data)=>onCallSendEmail(data,currentUser), { //data = array of users {}
    onSuccess: (email) => {
      if (email) notification.success({message:`E-mail para ${email} enviado com sucesso!`}) //Email enviado com sucesso, verifique em sua caixa de entrada e/ou span?
    },
    onError: (error) => {
      notification.error({message:`Falha ao enviar e-mail`})
    },
  })
}

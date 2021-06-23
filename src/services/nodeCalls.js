import axios from 'axios';
import {wordUpper,keepOnlyNumbers,formatCPFeCNPJeCEPeCNAE} from '../helpers/StringHandle'

//const LOCAL = 'http://simplesst/api/nodemailer.com.br'
const LOCAL = 'http://localhost:3001/api/nodemailer'

const errorCatch = (error) => {

    let errorMessage = error

    if (error.code === 'storage/unknown') {
      errorMessage = 'Ocorreu um erro desconhecido.'
    }
    else {
      errorMessage = error.message
    }

    console.log('error',error)
    console.log('error code',error.code)

    return errorMessage
  }

export function NodeSendInviteEmail(email,checkSuccess,checkError) {

    const EMAIL = email
    console.log('testeNode')

    let dataInfo = {
        to: EMAIL,
        subject:`Convite de participaçao da equipe Reconecta`,
        html: `<p><b>Seja Bem-vindo</b> a equipe Reconecta, um lugar para te ajudar a se reconectar com sua saúde e objetivos! <br/>
        <br/>
        Link de acesso para se cadastrar: <a href="https://reconecta.netlify.app/login?email=${EMAIL}">www.realizaconecta.com.br</a></p>
        <p>Qualquer dúvida, entre em contato.</p>`
    }

    console.log('dataInfo',dataInfo)

    axios.post('https://us-central1-reconecta-dev.cloudfunctions.net/mailer',dataInfo).then(res=>{
        checkSuccess(email)
    }).catch((error)=>{
        console.log('error',error)
        checkError('error',error)
    })
}

export function SeeIfCEPExists(CNPJ,companyId,checkSuccess,checkError) {

  // var companiesRef = db.collection("company").doc(companyId).collection('companies')

  // console.log(CNPJ)
  // companiesRef.where("CNPJ", "==", CNPJ).get()
  // .then(function(querySnapshot) {
  //     let response = false
  //     querySnapshot.forEach(function() {
  //       console.log(9)
  //         response = true
  //     })
  //     checkSuccess(response)
  //   }).catch((error) => {
  //     checkError(errorCatch(error))
  // });
}

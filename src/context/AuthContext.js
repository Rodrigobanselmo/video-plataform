import React, { useContext, useState, useEffect } from "react"
import { auth } from "../lib/firebase.prod"
import { useHistory,useLocation } from "react-router-dom"
import {DASHBOARD,SIGN} from '../routes/routesNames'
import {useNotification} from './NotificationContext'
import { useLoaderDashboard } from './LoadDashContext';
import {useLoaderScreen} from './LoaderContext'
import {GetUserData} from '../services/firestoreUser'
import {LogOut} from '../services/firebaseAuth'
import { useMutation } from "react-query";
import { useCreateUser } from "../services/hooks/set/useCreateUser"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("")
  const mutation = useCreateUser(setCurrentUser)

  const { setLoaderDash } = useLoaderDashboard();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        setCurrentUser(user)
        setLoaderDash(false)
      }
      if (user) mutation.mutate(user)
    })

    return unsubscribe
  //   setCurrentUser({
  //     company: {
  //         name: "simplesst",
  //         id: "nDSBFRU9H180cpXyAbtE"
  //     },
  //     image: "Admin",
  //     creation: {
  //         end: 0,
  //         start: 1613677117162
  //     },
  //     access: "master",
  //     type: "Master",
  //     status: "Ativo",
  //     admin: "Current",
  //     email: "rodrigobanselmo@gmail.com",
  //     uid: "IEU8lYKaOifsF1pXeIxWFffPfzZ2",
  //     info: {
  //         CREA: "123",
  //         CPF: "656.564.672-99"
  //     },
  //    name: "Rodrigo Barbosa Anselmo"
  // })
  // setLoaderDash(false)
  }, [])

  return (
    <AuthContext.Provider value={{currentUser,setCurrentUser}}>
      {currentUser !== '' && children}
    </AuthContext.Provider>
  )
}




/*     notification.modal({
      title:'Usuário Adicionado',
      text:'Um email de autenticação foi enviado aos usuários para se tornarem membros de sua equipe.',
      type:'inform',
      rightBnt:'OK',
      open:true,
    }) */

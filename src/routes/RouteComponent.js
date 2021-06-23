import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  HOME_ADMIN,
  DASHBOARD,
  SIGN,
  REQUEST_ADMIN_DATA
} from './routesNames'
// import {useNotification} from "../context/NotificationContext"

export default function RouteComponent({ component: Component,privateRoute, ...rest }) {

  const { currentUser } = useAuth()
  // const [location, setLocation] = React.useState(false)
  // const notification = useNotification()

  var locationRedirect = false

  function isAdminRoute() { //verifica se rota é admin e se for e user nao tiver access admin ele volta pra app e se for admin vai pra adminRoute
    if (rest?.location&&rest.location?.pathname && rest.location.pathname.split('/')[2] && rest.location.pathname.split('/')[2] == 'admin')  {
      if (currentUser?.access && currentUser.access == 'admin') {
        return 'admin'
      } else {
        locationRedirect = DASHBOARD
        return false
      }
    } else {
      if (currentUser?.access && currentUser.access == 'admin') {
        locationRedirect = HOME_ADMIN
        return false
      } else {
        return 'client'
      }
    }
  }

  function isToInputData(typeOfAccount) {
    console.log(typeOfAccount,currentUser?.politics,rest.location.pathname,REQUEST_ADMIN_DATA)
    if (typeOfAccount=='admin') {
      if ((('politics' in currentUser && currentUser.politics == '')||!currentUser?.politics) && rest.location.pathname == REQUEST_ADMIN_DATA) {
        return true
      } else if ((('politics' in currentUser && currentUser.politics == '')||!currentUser?.politics) && rest.location.pathname != REQUEST_ADMIN_DATA) {
        locationRedirect = REQUEST_ADMIN_DATA
        return false
      // } else if ('politics' in currentUser && currentUser.politics != '' && rest.location.pathname == REQUEST_ADMIN_DATA) {
      } else if ('politics' in currentUser && currentUser.politics && rest.location.pathname == REQUEST_ADMIN_DATA) {
        locationRedirect = HOME_ADMIN
        return false
      // } else if ('politics' in currentUser && currentUser.politics != '' && rest.location.pathname != REQUEST_ADMIN_DATA) {
      } else if ('politics' in currentUser && currentUser.politics && rest.location.pathname != REQUEST_ADMIN_DATA) {
        return true
      }
    }

    if (typeOfAccount=='client') {

    }
  }


  function onValidate() {
    if (currentUser) {
      if (!isAdminRoute()) return false
      if (!isToInputData(isAdminRoute())) return false


      return true
    } else {
      locationRedirect = SIGN
      return false
    }
  }

  return (
    <Route
      {...rest}
      render={props => {
        if (rest.isPrivate) return onValidate() ? <Component {...props} />
        :
        <>
        <Redirect to={{
          pathname: locationRedirect?locationRedirect:privateRoute,
          state: { from: props.location }
        }} />
{/*         {notification.error({message:'Você não possui autorização para acessar essa area.'})} */}
        {/* {console.log(props.location)} */}
        </>

        else return <Component {...props} />
      }}
    ></Route>
  )
}


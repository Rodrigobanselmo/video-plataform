import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  HOME_ADMIN,
  DASHBOARD,
  SIGN,
  REQUEST_DATA,
  VERIFY_EMAIL,
  HOME,
} from './routesNames'
// import {useNotification} from "../context/NotificationContext"

export default function RouteComponent({ component: Component,privateRoute, ...rest }) {

  const { currentUser } = useAuth()
  // const { pathname } = useLocation();
  // const [location, setLocation] = React.useState(false)
  // const notification = useNotification()

  var locationRedirect = false

  function isAdminRoute() { //verifica se rota é admin e se for e user nao tiver access admin ele volta pra app e se for admin vai pra adminRoute

    const ROUTE_HAS_ADMIN = rest?.location?.pathname && rest.location.pathname.split('/')[2] && rest.location.pathname.split('/')[2] == 'admin'
    const ROUTE_IS_DASHBOARD = rest?.location?.pathname == DASHBOARD
    const USER_IS_ADMIN = currentUser?.access && currentUser.access == 'admin'

    if ( ROUTE_HAS_ADMIN )  {

      if (USER_IS_ADMIN) return 'admin'
      else {
        locationRedirect = DASHBOARD
        return false
      }

    } else {

      if ( USER_IS_ADMIN && ROUTE_IS_DASHBOARD ) { //?se nao tiver admin na rota redireciona pra home do admin
        locationRedirect = HOME_ADMIN
        return false
      }

      if (USER_IS_ADMIN) return 'admin'
      else return 'client'

    }
  }

  function isToInputData() {

    const HAS_COMPANY = currentUser?.permissions && Array.isArray(currentUser.permissions) && currentUser.permissions.includes('co'); //company
    const HAS_PROFESSION = currentUser?.permissions && Array.isArray(currentUser.permissions) && currentUser.permissions.includes('pr'); //professional

    const PERSONAL_DATA = currentUser?.name && currentUser?.rg && currentUser?.cell;
    const COMPANY_DATA = currentUser?.address?.cep && currentUser?.company?.cpfOrCnpj;
    const PROFESSION_DATA = currentUser?.resume;

    const NEED_DATA = !PERSONAL_DATA || ( HAS_COMPANY && !COMPANY_DATA) || (HAS_PROFESSION && !PROFESSION_DATA)
    const ROUTE_IS_REQUEST_DATA = rest.location.pathname == REQUEST_DATA

    console.log(currentUser)
    if ( NEED_DATA && ROUTE_IS_REQUEST_DATA ) {
      return true
    } else if ( NEED_DATA && !ROUTE_IS_REQUEST_DATA ) {
      locationRedirect = REQUEST_DATA
      return false
    } else if ( !NEED_DATA && ROUTE_IS_REQUEST_DATA ) {
      locationRedirect = DASHBOARD
      return false
    } else if ( !NEED_DATA && !ROUTE_IS_REQUEST_DATA ) {
      return true
    }
  }

  function isVerification() {

    const ROUTE_IS_VERIFY_EMAIL = rest?.location?.pathname === VERIFY_EMAIL


    if (!currentUser.emailVerified && !ROUTE_IS_VERIFY_EMAIL) { //verification screen if not verified
      locationRedirect = VERIFY_EMAIL
      return false;
    } else if (currentUser.emailVerified && ROUTE_IS_VERIFY_EMAIL) { // in verification screen and verify is true go to dashboard
      locationRedirect = DASHBOARD
      return false;
    } else if (!currentUser.emailVerified && ROUTE_IS_VERIFY_EMAIL) {
      return true
    }

    return 'next'
  }

  function onValidate() {
    if (currentUser) {

      const isVerify = isVerification()
      if (isVerify != 'next') return isVerify

      if (!isToInputData()) return false
      if (!isAdminRoute()) return false //se estiver na rota tanto admim quanto client  eu redireciono


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


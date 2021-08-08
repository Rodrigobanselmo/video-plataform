import React, {useState,useEffect} from 'react'
// import Modal from './Modal'
import HeaderProfile from '../../../../components/Dashboard/Components/Blocks/HeaderProfile'
import {useNotification} from '../../../../context/NotificationContext'
import {useAuth} from '../../../../context/AuthContext'
import {useLoaderScreen} from '../../../../context/LoaderContext'
import { useLocation,useParams } from 'react-router-dom';
import {useLoaderDashboard} from '../../../../context/LoadDashContext'
import {ProfilePrimaryUserData} from '../../../../components/Containers/Profile/ProfilePrimaryUserData'
import {ProfileHistory} from '../../../../components/Containers/Profile/ProfileHistory'
import styled from "styled-components";

const Container = styled.div`
  max-width:1200px;
  margin: auto;
`;


const Section = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

function Team() {

  const {currentUser,setCurrentUser} = useAuth()
  const [user, setUser] = useState(false)
  const [queryOld, setQueryOld] = useState(false)

  const {setLoad} = useLoaderScreen();
  const notification = useNotification()
  // const query = new URLSearchParams(useLocation().search)
  const { setLoaderDash } = useLoaderDashboard();

  let { userId } = useParams();

  const isOtherUser = userId && currentUser?.permissions && Array.isArray(currentUser.permissions) && currentUser.permissions.includes('ea')

  useEffect(() => {
    setUser(currentUser)
    setLoaderDash(false)
  }, []) //query,

    if (!user?.email) return <></>
    return (
        <Container>
          <Section>
            <ProfilePrimaryUserData user={user} setCurrentUser={setCurrentUser}/>
            <ProfileHistory user={user} />
          </Section>
        </Container>
    )
}

export default Team

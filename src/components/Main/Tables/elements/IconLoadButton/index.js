import React from 'react'
import styled,{css, ThemeContext} from "styled-components";
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

export function IconLoadButton({useMutation,user,children,...props}) {

  const mutation = useMutation()
  const theme = React.useContext(ThemeContext)

  return (
    <>
      <IconButton onClick={()=>mutation.mutateAsync(user)} disabled={mutation.isLoading} style={{width:45,height:45}} {...props}>
        {!mutation.isLoading ? (
            children
          ) : (
            <CircularProgress size={20} style={{color: theme.palette.primary.main,fontSize:10}} />
        )}
        </IconButton>
    </>
  )
}

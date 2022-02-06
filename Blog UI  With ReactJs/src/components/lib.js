/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx} from '@emotion/react'
import styled from '@emotion/styled/macro';
import { keyframes } from '@emotion/react';
import * as mq from '../styles/mq'
import * as style from '../styles/colors'
import {FaSpinner} from 'react-icons/fa'
import {Link as RouterLink} from 'react-router-dom'
import  {DialogContent as ReachDialogContent}  from '@reach/dialog'
import  {DialogOverlay as ReachDialogOverlay}  from '@reach/dialog'




const buttonVariants = {
    primary : {
        background:style.lightgreen,
    },
    secondary:{
        background:style.bluegrey,
    },
    tertiary:{
        background:style.lightred,
    }
}
const spin = keyframes({
  '0%': {transform :'rotate(0deg)'},
  '100%': {transform :'rotate(360deg)'},
})
const Spinner = styled(FaSpinner)({
  animation :`${spin} 1s linear infinite`,
  fontSize : `130%`,
})
Spinner.defaultProps = {
  'aria-label': 'loading',
}
function FullPageSpinner() {
  return (
    <div
      css={{
        color:'red',
        fontSize: '4em',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'20%'
       //justifyContent: 'center',

      }}
    >
      <Spinner />
    </div>
  )
}
const Button = styled.button(
    {
        border: `1px solid ${style.border}`,
        maxWidth:'75px',
        minHeight:'40px',
        borderRadius:'3px',   
    }
,({variant='primary'})=>buttonVariants[variant])
const BtnAndSpinner = styled.div({
    display:'grid',
    gridTemplateColumns : 'repeat(2,minmax(0,1fr))' ,
    alignItems:'center',

})
BtnAndSpinner.defaultProps ={
  'aria-label' :'Loading'
}
const Input = styled.input({
    borderRadius: '3px',
    border: `1px solid ${style.border}`,
    background: style.ghostWhite,
    padding: '8px 12px',
  })
 const FormGroup = styled.div({
    display: 'flex',
    flexDirection: 'column',
  })

  const DialogContent = styled(ReachDialogContent)({
    width:"100%",
    height:'auto',
    maxWidth: '350px',
    minWidth:'350px',
    borderRadius: '3px',
    paddingBottom: '3.5em',
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
    margin: '13vh auto',

  })
  const DialogOverlay = styled(ReachDialogOverlay)({
    [mq.small]: {
      width: '100%',
      // margin: '7vh auto',
      padding :'10% 0',
    },
  })
  const MainTitle = styled.div({
      //background: style.oldLace,
      display:'flex',
      width: '100%',
      color: style.golden,
      alignItems:'center',
      transform: 'translateY(-15px)',
      textAlign:'center',
      
      
  })
  const CircleButton = styled.button({
    borderRadius: '30px',
    padding: '0',
    width: '40px',
    height: '40px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:'#909090',
    color: 'black',
    border: `1px solid gray`,
    cursor: 'pointer',
  })
  const PostsListUL = styled.ul({
    listStyle: 'none',
    padding: '0',
    display: 'grid',
    gridTemplateRows: 'repeat(auto-fill, minmax(100px, 1fr))',
    gridGap: '1em',
  })
  const errorMessageVariants = {
    stacked: {display: 'block'},
    inline: {display: 'inline-block'},
  }
  function ErrorMessage({error, variant = 'stacked', ...props}) {
    return (
      <div
        role="alert"
        css={[{color: 'red'}, errorMessageVariants[variant]]}
        {...props}
      >
        <span>There was an error: </span>
        <pre
          css={[
            {whiteSpace: 'break-spaces', margin: '0', marginBottom: -5},
            errorMessageVariants[variant],
          ]}
        >
          {error.message}
        </pre>
      </div>
    )
  }
  const Link = styled(RouterLink)({
    color: 'indigo',
    ':hover': {
      color: '#2A0D5D',
      textDecoration: 'underline',
    },
  })
  
export {
  PostsListUL,
  Input,
  Button,
  FormGroup,
  DialogContent,
  DialogOverlay,
  MainTitle,
  Spinner,
  BtnAndSpinner,
  ErrorMessage,
  FullPageSpinner,
  Link,
  CircleButton
}
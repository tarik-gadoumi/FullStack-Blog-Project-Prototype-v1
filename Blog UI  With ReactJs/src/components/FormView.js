/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react'
import {jsx} from '@emotion/react'
import "@reach/dialog/styles.css";
import { Logo  } from './logos'
import {ModalProvider,OpenModalBtn,ModalContents} from './modal'
import { Button ,Input ,FormGroup,MainTitle,Spinner,BtnAndSpinner } from './lib'
import { useAsync } from '../utils/hooks';
import { ErrorMessage } from './lib';
import * as mq from '../styles/mq'


const Form = ({onSubmit,submitButton,otherprops}) => {
    const {isLoading, isError, error, run} = useAsync()
    function handleSubmit (e){
        e.preventDefault()
        const {email,password,username:usernameAlias}= e.target.elements//DOM nodes
        const  otherProps = usernameAlias ? {username : usernameAlias.value} : null ;
       run(
        onSubmit({
                email:email.value, //DOM values from nodes
                password:password.value,
                ...otherProps,
                 })
       )       
    }
    return (
        <form
        css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '> div': {
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px',
        },
      }}
        onSubmit={handleSubmit}
        method="POST">
            <FormGroup>
                <label htmlFor='Email'>Email</label>
                {/* changed from  username  to  email */}
                <Input name='email' type='text'></Input>
            </FormGroup>
            <FormGroup>
                <label htmlFor='password'>Password</label>
                <Input name='password' type='password'></Input>
            </FormGroup>
           <FormGroup>
                 {otherprops}
           </FormGroup>
            <BtnAndSpinner>
                {React.cloneElement(submitButton, {type: 'submit'})}
                {isLoading ? <Spinner/> : null}
                {isError ? <ErrorMessage error={error} /> : null}
            </BtnAndSpinner>


        </form>
    )
}
const LogView  = ({login,register}) => {
    


   return <div  css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth:'450px',
                minWidth:'200px',
                margin:'auto',
                backgroundColor:'rgba(0,0,0,.75)',
                borderRadius:'5px',
                marginTop:'50px',
                padding:'50px',
                [mq.small]: {
                    width: '90%',
                    margin: '12vh auto',
                  },
            }}>
                 <Logo/>
                 <MainTitle>
                    <h1 css={{margin:'0',width:'100%',wordWrap:'break-word',}}>The Great <br/> <span css={{background:'yellow',color:'black'}}>JS</span> Samouraï </h1>
                 </MainTitle>
              <div css={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gridGap: '0.75rem',
                    }}>
                <ModalProvider>
                        <OpenModalBtn>
                                <Button variant="primary" >Login</Button>
                        </OpenModalBtn>
                        <ModalContents aria-label="Login form" title="Login">
                            <Form
                            onSubmit={login}
                            submitButton={<Button variant="primary">Login</Button>}
                            />
                        </ModalContents>
                </ModalProvider>

                <ModalProvider>
                        <OpenModalBtn>
                                <Button variant="secondary" >Register</Button>
                        </OpenModalBtn>
                        <ModalContents aria-label="Registration form" title="Register">
                            <Form
                            onSubmit={register}
                            submitButton={<Button variant="secondary">Register</Button>}
                            otherprops={[<label key="1" htmlFor='username'>Username</label>,
                                         <Input key="2" name='username' type='username'></Input>
                                       ]}
                            />
                        </ModalContents>
                </ModalProvider>
            </div>
          </div>
}
export  {LogView}
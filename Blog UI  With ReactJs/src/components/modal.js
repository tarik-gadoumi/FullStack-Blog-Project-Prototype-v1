/** @jsxRuntime classic */

/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import { Button,DialogContent,DialogOverlay} from './lib';
import { motion, AnimatePresence } from "framer-motion"
//import {DialogOverlay} from '@reach/dialog'


const callAll = (...fns) => (...args)=> fns.forEach(fn=> fn && fn(...args)) ;

const modalContext = React.createContext() ;

 function ModalProvider (props){
     const [isOpen,setIsOpen]= React.useState(false);
        const MotionDialogOverlay = motion(DialogOverlay);
        const MotionDialogContent = motion(DialogContent);
        const val = [isOpen,setIsOpen,MotionDialogContent,MotionDialogOverlay]
     return <modalContext.Provider  value={val} {...props}/>
 }

 function OpenModalBtn({children:child}){
     const [,setIsOpen]= React.useContext(modalContext)
     
      return React.cloneElement(child,{
          onClick : callAll(()=>setIsOpen(true), child.props.onClick),
      })
 }

 function CloseModalBtn({children:child}){
    const [,setIsOpen]= React.useContext(modalContext)
     return React.cloneElement(child,{
         onClick : callAll(()=>setIsOpen(false), child.props.onClick),
     })
}

function ModalContentsBase({title,...props}){
    const [isOpen ,setIsOpen ,MotionDialogContent ,MotionDialogOverlay]= React.useContext(modalContext) ; 
    return (

        <AnimatePresence>
            {
                isOpen ? (
                        <MotionDialogOverlay
                        initial ={{opacity:0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onDismiss={()=> setIsOpen(false)}
                        >
                             <MotionDialogContent
                             initial ={{opacity:0, marginTop:10 }}
                             animate={{opacity: 1, marginTop: title==='Login'? 110:title==='Register'? 80 : void 0}}
                             exit={{opacity: 0, marginTop:10}}
                             transition={{duration:0.25}}
                             aria-label='content dialog'
                             {...props}
                             >
                                
                             </MotionDialogContent>
                        </MotionDialogOverlay>
                        
                ): null 
            }
         </AnimatePresence>  
    )
}

function ModalContents({title,children,...props}){
    return (
        
            <ModalContentsBase title={title} {...props}>
                        <div css={{display: 'flex', justifyContent: 'flex-end'}}>
                            <CloseModalBtn>
                                <Button variant="tertiary">
                                    <VisuallyHidden>Close</VisuallyHidden>
                                    <span aria-hidden>Close</span>
                                </Button>
                            </CloseModalBtn>
                        </div>
                        <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
                        {children}
            </ModalContentsBase>
           
    )
}
export {ModalProvider,OpenModalBtn,CloseModalBtn,ModalContents}
import logoPath from  '../img/js-engineer.webp'

const Logo = ({width='100%',height='auto', minWidth='200px'}) => {
   return <img src={logoPath} alt='logo' style={{width,height,minWidth}}/>
}


export {  Logo}

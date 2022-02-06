import axios  from "axios"


const localStorageKey = '__auth_provider_token__'
const firstRender = 'first-rendering'
async function getToken() {

  return window.localStorage.getItem(localStorageKey)
}

function handleUserResponse(response) {
  window.localStorage.setItem(localStorageKey, response.data.data.token)
  return response.data.data
}

async function login(dataForm) {
  return clientLogin(dataForm).then(handleUserResponse)
}

function register(dataForm) {
  return clientRegister(dataForm).then(handleUserResponse)
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
  window.localStorage.removeItem(firstRender)

}


const authURL = process.env.REACT_APP_AUTH_URL
const registerURL=process.env.REACT_APP_REGISTER_URL

async function clientLogin (dataForm){
   
  const fd = new FormData();
  fd.append('email', dataForm.email);
  fd.append('password', dataForm.password);

 const config = {
   headers: {
     'Content-Type': 'application/x-www-form-urlencoded'
   }
 }
return  await axios.post(authURL,fd,config)
 
}

async function clientRegister (dataForm){
   
  const fd = new FormData();
  fd.append('email', dataForm.email);
  fd.append('password', dataForm.password);
  //name  et nom  username pcq dans ma db  j ai  utilisé name :/
  fd.append('name', dataForm.username);

 const config = {
   headers: {
     'Content-Type': 'application/x-www-form-urlencoded'
   }
 }
return  await axios.post(registerURL,fd,config)
 
}

export {getToken, login, register, logout, localStorageKey,firstRender}

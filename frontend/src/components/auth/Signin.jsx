import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useNotification } from '../../hooks'
import { isValidEmail } from '../../utils/helper'
import { commonModalClasses } from '../../utils/theme'
import Container from '../Container'
import CustomLink from '../CustomLink'
import FormContainer from '../form/FormContainer'
import Forminput from '../form/Forminput'
import Submit from '../form/Submit'
import Title from '../form/Title'

const ValidateUserInfo = ({email,password})=>{
  if(!email.trim()) return {ok:false,error:'email is missing'};
  if(!isValidEmail(email)) return {ok:false,error:'Email is invalid'}

  if(!password.trim()) return {ok:false, error: 'Password is missing!'};
  if(password.length<8) return {ok:false,error:'Password must be 8 characters long.'};

  return {ok:true};
}

export default function Signin() {
  // const theme = useContext(ThemeContext); 
  //instead of importing both usecontext and themecontext, gonna use own hook useTheme to do above work

  const [userInfo,setUserInfo] = useState({
    email:"",
    password:""
  });

  const navigate = useNavigate();
  const {updateNotification} = useNotification();
  const {handleLogin,authInfo} = useAuth();
  // console.log(authInfo);
  const {isPending,isLoggedIn} = authInfo;
  console.log(authInfo);
  const handleChange = ({target}) => {   //target is destructed from event i.e e.target
    // console.log(target.value,target.name);
    setUserInfo({...userInfo,[target.name]:target.value});
  } 

  const handleSubmit = async(e) =>{
    e.preventDefault();
    // console.log(userInfo);
    const {ok,error} = ValidateUserInfo(userInfo);
    if(!ok) return updateNotification('error',error);
    handleLogin(userInfo.email,userInfo.password);

  }

  // useEffect(()=>{
  //   if(isLoggedIn) navigate('/')
  // },[isLoggedIn]);

  // const theme = useTheme();
  return (
    <FormContainer> 
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses +' w-72'}>
                <Title>Sign in</Title>
                <Forminput value={userInfo.email} label='Email' onChange={handleChange}
                placeholder='John@email.com' name='email'></Forminput>
                <Forminput value={userInfo.password} label='Password' onChange={handleChange}
                placeholder='********' name='password' type='password'></Forminput>
                <Submit value='Sign in' busy={isPending}/>
                <div className="flex justify-between">
                  <CustomLink to="/auth/forget-password">Forget password</CustomLink>
                  <CustomLink to="/auth/signup">Sign up</CustomLink>
                </div>
            </form>
        </Container>
    </FormContainer>
  )
}

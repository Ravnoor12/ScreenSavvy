import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../../api/auth'
import { useAuth, useNotification } from '../../hooks'
import { isValidEmail } from '../../utils/helper'
import { commonModalClasses } from '../../utils/theme'
import Container from '../Container'
import CustomLink from '../CustomLink'
import FormContainer from '../form/FormContainer'
import Forminput from '../form/Forminput'
import Submit from '../form/Submit'
import Title from '../form/Title'

  const ValidateUserInfo = ({name,email,password})=>{
    const isValidName = /^[a-z A-Z]+$/;
    if(!name.trim()) return {ok:false, error: 'Name is missing!'};
    if(!isValidName.test(name)) return {ok:false,error:'Name is invalid.'};

    if(!email.trim()) return {ok:false,error:'email is missing'};
    if(!isValidEmail(email)) return {ok:false,error:'Email is invalid'}

    if(!password.trim()) return {ok:false, error: 'Password is missing!'};
    if(password.length<8) return {ok:false,error:'Password must be 8 characters long.'};

    return {ok:true};
  }

export default function Signup() {

  const [userInfo,setUserInfo] = useState({
    name:"",
    email:"",
    password:""
  });

  const navigate = useNavigate();
  const {updateNotification} = useNotification();
  const {handleLogin,authInfo} = useAuth();
  const {isPending,isLoggedIn} = authInfo;

  const {name,email,password} = userInfo;

  const handleChange = ({target}) => {   //target is destructed from event i.e e.target
    // console.log(target.value,target.name);
    setUserInfo({...userInfo,[target.name]:target.value});
  } 

  const handleSubmit = async(e) =>{
    e.preventDefault();
    // console.log(userInfo);
    const {ok,error} = ValidateUserInfo(userInfo);
    if(!ok) return updateNotification('error',error);
    const response = await createUser(userInfo); 
    if(response.error) return console.log(response.error);
    console.log(response.user);
    navigate('/auth/verification', {state: {user: response.user},replace:true} ) // replace will not let the user to go back to sign up page once the verification page opens 
    // backend api needs userId and otp, to provide userId passing the response 
    // for reference : https://stackoverflow.com/questions/70621070/how-do-i-pass-props-to-next-screen-using-navigate#:~:text=you%20can%20pass%20some%20props%20using%20navigate%20and%20route.

  }

  useEffect(()=>{
    if(isLoggedIn) navigate('/')
  },[isLoggedIn])

  return (
    <FormContainer> 
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + ' w-72'}>
                <Title>Sign up</Title>
                <Forminput label='Name' value={name} onChange={handleChange}
                placeholder='John Doe' name='name'></Forminput>
                <Forminput label='Email' value={email} onChange={handleChange}
                placeholder='John@email.com' name='email'></Forminput>
                <Forminput label='Password' value={password} type='password' onChange={handleChange}
                placeholder='********' name='password'></Forminput>
                <Submit value='Sign up'/>
                <div className="flex justify-between">
                  <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
                  <CustomLink to="/auth/signin">Sign in</CustomLink>
                </div>
            </form>
        </Container>
    </FormContainer>
  )
}

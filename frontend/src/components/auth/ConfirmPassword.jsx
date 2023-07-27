import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { commonModalClasses } from '../../utils/theme'
import Container from '../Container'
import FormContainer from '../form/FormContainer'
import Forminput from '../form/Forminput'
import Submit from '../form/Submit'
import Title from '../form/Title'
import {ImSpinner3} from 'react-icons/im'
import { resetPassword, verifyPasswordResetToken } from '../../api/auth'
import { useNotification } from '../../hooks'

export default function ConfirmPassword() {

    const [password,setPassword] = useState({
      One: '',
      Two:''
    });

  const navigate = useNavigate();
  const {updateNotification} = useNotification();

  const [isVerifying,setIsVerifying] = useState(true);
  const [isValid,setIsValid] = useState(false);  

  const [searchParams] = useSearchParams(); // using this to get token and id from the URL
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  // console.log(token,id);

  useEffect(()=>{
    isValidToken();
  },[]);

  const isValidToken = async()=>{
    const {error,valid} = await verifyPasswordResetToken(token,id);
    setIsVerifying(false);
    if(error) {
      navigate('/auth/reset-password',{replace:true});
      return updateNotification('error',error);
    }
    if(!valid) {
      setIsValid(false);
      return navigate('/auth/reset-password',{replace:true});
    }
    setIsValid(true);
  }

  const handleChange = ({target})=>{
    const {name,value} = target;
    setPassword({...password,[name]:value});
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!password.One.trim()) return updateNotification('error','Password is missing!');
    if(password.One.trim().length < 8 ) return updateNotification('error','Password must be 8 characters long!');
    if(password.One!==password.Two) return updateNotification('error','Password do not match!');
    const {error,message} = await resetPassword({newPassword: password.One,userId: id,token});
    if(error) return updateNotification('error',error);
    updateNotification('success',message);
    navigate('/auth/signin',{replace:true});
    console.log(password);
  }

  if(isVerifying) return(
    <FormContainer>
      <Container>
        <div className='flex space-x-2 items-center'>
            <h1 className='text-4xl font-semibold dark:text-white text-primary'>
              Please wait we are verifying your token!</h1>
            <ImSpinner3 className='animate-spin text-4xl dark:text-white text-primary'/>
        </div>
      </Container>
    </FormContainer>
  );

  if(!isValid) return(
    <FormContainer>
      <Container>
            <h1 className='text-4xl font-semibold dark:text-white text-primary'>
              Sorry the token is invalid!</h1>
      </Container>
    </FormContainer>
  );  

  return (
    <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses + ' w-96'}>
                    <Title>Enter New password</Title>
                    <Forminput label='New Password' placeholder='********'
                    type='password' name='One' onChange={handleChange} value={password.One}></Forminput>
                    <Forminput label='Confirm Password' placeholder='********' 
                    type='password' name='Two' onChange={handleChange} value={password.Two}></Forminput>
                    <Submit value='Confirm Password' />
                </form>
            </Container>
        </FormContainer>
  );
}

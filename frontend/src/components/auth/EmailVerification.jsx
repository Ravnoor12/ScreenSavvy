import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { resentEmailVerificationToken, verifyUserEmail } from '../../api/auth';
import { useAuth, useNotification } from '../../hooks';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container'
import FormContainer from '../form/FormContainer';
import Submit from '../form/Submit'
import Title from '../form/Title'

const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp)=> {
    // ['','',..]  need to verify if all input is int and all
    let valid = 0;
    for(let i=0;i<6;i++){
        valid = !isNaN(parseInt(otp[i]));
        if(!valid) return 0;
    }
    return valid;    
}

export default function EmailVerification() {
    const [otp,setOtp] = useState(new Array(OTP_LENGTH).fill(''))
    const [activeOtpIndex,setActiveOtpIndex] = useState(0);

    const {isAuth,authInfo} = useAuth();
    const {isLoggedIn,profile} = authInfo;
    const isVerified = profile?.isVerified;
    const inputRef = useRef();
    const {updateNotification} = useNotification();

    const {state} = useLocation(); // getting the userId for backend from handleSubmit in signup.jsx
    const user = state?.user;
    const navigate = useNavigate();
    // eslint-disable-next-line

    const focusNextInputField = (index) =>{
        setActiveOtpIndex(index+1);
    }

    const focusPreviousInputField = (index) =>{
        let prevIndex;
        const diff = index-1;
        prevIndex = diff !==0 ? diff:0;
        setActiveOtpIndex(prevIndex);
    }

    const handleOtpChange = (e,index) => {
        const {value} = e.target;
        // console.log(value);
        console.log(value);
        const newOtp = [...otp] // ... spread operator, copying the otp array in newOtp
        //newOtp[index] = value.substring(value.length-1,value.length); //didn't work bcoz of problem 1(notes)
        newOtp[currentOTPIndex] = value.substring(value.length-1,value.length); // writing the digit which is at last index in value at ith position i.e index
        if(!value) focusPreviousInputField(currentOTPIndex);
        else focusNextInputField(currentOTPIndex);
        setOtp(newOtp);  // updating the array 
    };

    const handleOTPResend = async()=>{
        const {error,message} = await resentEmailVerificationToken(user.id);
        if(error) return updateNotification('error',error)
        updateNotification('success',message);
    }

    const handleKeyDown = (e,index) =>{
        currentOTPIndex = index;
        if(e.key==='Backspace'){
            focusPreviousInputField(currentOTPIndex);
        }
        // console.log(e.key);
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!isValidOTP(otp)){
            return updateNotification('error','Invalid OTP');
        };
        const {error,message,user:userResponse} = await verifyUserEmail({userId: user.id,OTP: otp.join('')}); // join will convert the array of strings to int
        if(error) return updateNotification('error',error);
        updateNotification('success',message);
        console.log(message);
        localStorage.setItem('auth-token',userResponse.token);
        isAuth();
    }

    useEffect(() => {  //componentDidUpdate or in starting it is like componentdidmount
        inputRef.current?.focus()
        // console.log(inputRef);
    },[activeOtpIndex])

    useEffect(()=>{
        if(!user) navigate('/not-found');
        if(isLoggedIn && isVerified) navigate('/');
        // eslint-disable-next-line
    },[user,isLoggedIn,isVerified])

  return (
    <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses}>
                    <div>
                        <Title>Please enter the OTP to verify your account</Title>
                        <p className='text-center dark:text-dark-subtle text-light-subtle'>OTP has been sent to your email</p>
                    </div>
                    <div className='flex justify-center items-center space-x-4'>
                        {otp.map((_,index) => {
                            return(
                            <input 
                            ref={activeOtpIndex ===index ? inputRef : null}  //refhook passes reference here
                            type='number' key={index} value={otp[index] || "" } 
                            onChange={(e) =>handleOtpChange(e,index)}
                            onKeyDown={(e) =>handleKeyDown(e,index)}
                            className="w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle
                            dark:focus:border-white focus:border-primary rounded bg-transparent 
                            outline-none text-center dark:text-white text-primary font-semibold text-xl
                            spin-button-none"/>
                            )
                        })}
                    </div>
                    <div >
                        <Submit value='Verify Account' />
                        <button type='button' onClick={handleOTPResend}
                         className='dark:text-white text-blue-500 font-semibold hover:underline'>
                            I don't have OTP</button>
                    </div>
                </form>
            </Container>
        </FormContainer>
  )
}
